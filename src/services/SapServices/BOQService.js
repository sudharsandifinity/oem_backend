const SapBaseSetvice = require("./SapBaseService");
const SAPService = new require('../SAPService');


class BOQService extends SapBaseSetvice {

    constructor(){
        super()
    }

    async getOpenBOQs(req, qry) {
        const response = await this.sapClient.GetBOQs(req, qry);
        return response.data.value;
    }

    async getBoqOpenQty(req, docEntry, excludeMr) {
        const bomRes = await this.sapClient.GetBOQById(req, docEntry);
        const bom = bomRes.data || {};

        const planned = {};
        for (const l of bom.HLB_BOQT1Collection || []) {
            if (String(l.U_Type || '').trim() === 'Regular' && l.U_UniqueID != null && String(l.U_UniqueID) !== '') {
                planned[String(l.U_UniqueID)] = Number(l.U_PQty) || 0;
            }
        }

        const mrRes = await this.sapClient.GetMRsByBOMEntry(req, docEntry);
        const mrs = mrRes.data?.value || [];

        const consumed = {};
        for (const mr of mrs) {
            if (excludeMr != null && String(mr.DocEntry) === String(excludeMr)) continue;
            for (const line of mr.HLB_MRQ1Collection || []) {
                if (String(line.U_BOMEntry) === String(docEntry) && line.U_BOMLine != null) {
                    const key = String(line.U_BOMLine);
                    consumed[key] = (consumed[key] || 0) + (Number(line.U_ReqQty) || 0);
                }
            }
        }

        const lines = Object.keys(planned).map((uid) => {
            const plannedQty = planned[uid];
            const used = consumed[uid] || 0;
            return { U_UniqueID: uid, planned: plannedQty, used, available: plannedQty - used };
        });

        return { docEntry: Number(docEntry), lines };
    }

}

module.exports = BOQService;