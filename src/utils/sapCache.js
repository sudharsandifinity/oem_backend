const DEFAULT_MAX_ENTRIES = 15000;
const SWEEP_INTERVAL_MS = 60 * 1000;

const store = new Map();

let hits = 0;
let misses = 0;
let evictions = 0;

function buildKey(req, namespace, ...parts) {
    const company = req?.user?.companyName;
    if (!company) {
        throw new Error(`sapCache: cannot build key for "${namespace}" - req.user.companyName is missing`);
    }
    if (!namespace) {
        throw new Error('sapCache: namespace is required');
    }
    return [namespace, company, ...parts.map((p) => (p === undefined || p === null ? '' : String(p)))].join('|');
}

function isExpired(entry, now = Date.now()) {
    return entry.expiresAt <= now;
}

function enforceMaxEntries(maxEntries) {
    if (store.size <= maxEntries) return;
    const excess = store.size - maxEntries;
    let removed = 0;
    for (const key of store.keys()) {
        store.delete(key);
        removed += 1;
        evictions += 1;
        if (removed >= excess) break;
    }
}

async function getOrFetch(key, ttlMs, fetchFn, options = {}) {
    if (!key) throw new Error('sapCache: key is required');
    if (!Number.isFinite(ttlMs) || ttlMs <= 0) {
        return fetchFn();
    }

    const existing = store.get(key);
    if (existing && !isExpired(existing)) {
        hits += 1;
        return existing.promise;
    }
    if (existing) store.delete(key);

    misses += 1;
    const storedAt = Date.now();
    const promise = (async () => fetchFn())().then(
        (value) => {
            const entry = store.get(key);
            if (entry && entry.promise === promise) {
                entry.settled = true;
                const emptyTtl = options.emptyTtlMs;
                if (emptyTtl && isEmptyResult(value)) {
                    entry.expiresAt = Math.min(entry.expiresAt, storedAt + emptyTtl);
                }
            }
            return value;
        },
        (err) => {
            store.delete(key);
            throw err;
        }
    );

    store.set(key, { promise, expiresAt: storedAt + ttlMs, storedAt, settled: false });
    enforceMaxEntries(options.maxEntries || DEFAULT_MAX_ENTRIES);

    return promise;
}

function isEmptyResult(value) {
    if (value === null || value === undefined) return true;
    if (Array.isArray(value)) return value.length === 0;
    if (Array.isArray(value?.value)) return value.value.length === 0;
    return false;
}

function clear(prefix) {
    if (!prefix) {
        const n = store.size;
        store.clear();
        return n;
    }
    let n = 0;
    for (const key of store.keys()) {
        if (key.startsWith(prefix)) {
            store.delete(key);
            n += 1;
        }
    }
    return n;
}

function sweep() {
    const now = Date.now();
    let removed = 0;
    for (const [key, entry] of store) {
        if (isExpired(entry, now)) {
            store.delete(key);
            removed += 1;
        }
    }
    return removed;
}

function stats() {
    const now = Date.now();
    const byNamespace = {};
    const keys = [];

    for (const [key, entry] of store) {
        const namespace = key.split('|')[0];
        byNamespace[namespace] = (byNamespace[namespace] || 0) + 1;
        keys.push({
            key,
            state: entry.settled ? 'resolved' : 'in-flight',
            ageMs: now - entry.storedAt,
            expiresInMs: Math.max(0, entry.expiresAt - now)
        });
    }

    const mem = process.memoryUsage();
    const total = hits + misses;
    return {
        entries: store.size,
        byNamespace,
        hits,
        misses,
        hitRate: total ? `${((hits / total) * 100).toFixed(1)}%` : 'n/a',
        evictions,
        heapUsedMB: Number((mem.heapUsed / 1024 / 1024).toFixed(1)),
        keys: keys.sort((a, b) => a.key.localeCompare(b.key))
    };
}

const sweepTimer = setInterval(() => {
    const removed = sweep();
    if (removed) console.log(`[SAP-CACHE] swept ${removed} expired entr${removed === 1 ? 'y' : 'ies'}, ${store.size} remaining`);
}, SWEEP_INTERVAL_MS);
if (typeof sweepTimer.unref === 'function') sweepTimer.unref();

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

const TTL = {
    APPROVAL_LEVELS: 15 * DAY,
    APPROVAL_LEVELS_EMPTY: 30 * 1000,
    EMPLOYEE: 90 * DAY,
    MASTER_DATA: 90 * DAY
};

module.exports = { buildKey, getOrFetch, clear, sweep, stats, TTL };
