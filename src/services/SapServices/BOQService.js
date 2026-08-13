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

        const bomLines = (bom.HLB_BOQT1Collection || []).filter(
            (l) => String(l.U_Type || '').trim() === 'Regular' && l.U_ItemCode
        );

        const mrRes = await this.sapClient.GetMRsByBOMEntry(req, docEntry);
        const mrs = mrRes.data?.value || [];

        const consumedByLine = {};
        for (const mr of mrs) {
            if (excludeMr != null && String(mr.DocEntry) === String(excludeMr)) continue;
            for (const line of mr.HLB_MRQ1Collection || []) {
                if (String(line.U_BOMEntry) === String(docEntry) && line.U_BOMLine != null) {
                    const key = String(line.U_BOMLine);
                    consumedByLine[key] = (consumedByLine[key] || 0) + (Number(line.U_ReqQty) || 0);
                }
            }
        }

        const lines = bomLines.map((l) => {
            const planned = Number(l.U_PQty) || 0;
            const used = consumedByLine[String(l.LineId)] || 0;
            return { U_UniqueID: String(l.U_UniqueID ?? ''), LineId: l.LineId, planned, used, available: planned - used };
        });

        return { docEntry: Number(docEntry), lines };
    }

}

module.exports = BOQService;