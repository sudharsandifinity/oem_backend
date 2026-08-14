const SapBaseSetvice = require("./SapBaseService");
const SAPService = new require('../SAPService');
const { Op } = require('sequelize');
const { ApprovalRequest } = require('../../models');


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

        const docEntries = [...new Set(mrs.map((m) => m.DocEntry).filter((d) => d != null))];
        const companyId = req.user?.companyID ?? null;
        const approvalRows = docEntries.length
            ? await ApprovalRequest.findAll({
                  where: {
                      docType: 'MR',
                      docEntry: { [Op.in]: docEntries },
                      ...(companyId ? { companyId } : {})
                  },
                  attributes: ['docEntry', 'status'],
                  raw: true
              })
            : [];
        const stateByDoc = {};
        approvalRows.forEach((r) => {
            stateByDoc[String(r.docEntry)] = r.status;
        });

        const resolveState = (mr) => {
            const ar = stateByDoc[String(mr.DocEntry)];
            if (ar) {
                if (ar === 'approved') return 'approved';
                if (ar === 'pending') return 'pending';
                return 'released';
            }
            if (mr.U_DocStatus === 'O') return 'approved';
            if (mr.U_DocStatus === 'D') return 'pending';
            return 'released';
        };

        const approvedByLine = {};
        const pendingByLine = {};
        for (const mr of mrs) {
            if (excludeMr != null && String(mr.DocEntry) === String(excludeMr)) continue;
            const state = resolveState(mr);
            if (state === 'released') continue;
            for (const line of mr.HLB_MRQ1Collection || []) {
                if (String(line.U_BOMEntry) !== String(docEntry) || line.U_BOMLine == null) continue;
                const key = String(line.U_BOMLine);
                if (state === 'approved') {
                    approvedByLine[key] = (approvedByLine[key] || 0) + (Number(line.U_ReqQty) || 0);
                } else {
                    pendingByLine[key] = (pendingByLine[key] || 0) + (Number(line.U_MRQty) || 0);
                }
            }
        }

        const lines = bomLines.map((l) => {
            const planned = Number(l.U_PQty) || 0;
            const approvedUsed = approvedByLine[String(l.LineId)] || 0;
            const pendingUsed = pendingByLine[String(l.LineId)] || 0;
            return {
                U_UniqueID: String(l.U_UniqueID ?? ''),
                LineId: l.LineId,
                planned,
                approvedUsed,
                pendingUsed,
                bomOpenQty: planned - approvedUsed,
                mrOpenQty: pendingUsed,
                tempAvailable: planned - approvedUsed - pendingUsed
            };
        });

        return { docEntry: Number(docEntry), lines };
    }

}

module.exports = BOQService;