const { encodeId } = require('./hashids');

function buildUserCompanies(json) {
    const companies = json.Companies || [];
    const branches = json.Branches || [];

    const byId = new Map();
    for (const c of companies) {
        if (byId.has(c.id)) continue;
        byId.set(c.id, { ...c, id: encodeId(c.id), Branches: [] });
    }

    for (const b of branches) {
        const companyId = b.companyId ?? b.Company?.id;
        const entry = byId.get(companyId);
        if (!entry) continue;
        const branch = { ...b };
        delete branch.Company;
        branch.id = encodeId(branch.id);
        if (branch.companyId != null) branch.companyId = encodeId(branch.companyId);
        entry.Branches.push(branch);
    }

    return [...byId.values()];
}

module.exports = { buildUserCompanies };
