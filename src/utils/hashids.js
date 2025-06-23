const Hashids = require('hashids/cjs');

const hashids = new Hashids(process.env.HASHIDS_SECRET || 'RDP6E2d2YBN37eKEdBoG', 10);

const encodeId = (id) => hashids.encode(id);
const decodeId = (hash) => {
  const decoded = hashids.decode(hash);
  return decoded.length ? decoded[0] : null;
};

module.exports = { encodeId, decodeId };