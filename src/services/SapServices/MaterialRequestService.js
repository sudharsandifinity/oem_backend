const SapBaseSetvice = require("./SapBaseService");
const PurchaseRequestService = require("./PurchaseRequestService");


class MaterialRequestService extends SapBaseSetvice {

    constructor(){
        super("MR");
        this.purchaseRequestService = new PurchaseRequestService();
    }

    async getMRs(req, qry) {
        const response = await this.sapClient.GetAllMRs(req, qry);
        return response.data.value;
    }

    buildPRPayloadFromMR = (mr) => {
        const today = new Date().toISOString().split('T')[0];
        const lines = (mr.HLB_MRQ1Collection || []).filter(
            (l) => l.U_ItmSerCode && Number(l.U_ReqQty) > 0
        );

        return {
            DocDate: `${today}T00:00:00Z`,
            RequriedDate: mr.U_ReqDate || null,
            Comments: mr.U_Remark || '',
            ReqType: mr.U_ReqType === 'E' ? 171 : 12,
            ReqCode: mr.U_ReqCode || '',
            RequesterName: mr.U_ReqName || '',
            RequesterDepartment: mr.U_Dept != null ? Number(mr.U_Dept) : null,
            SendNotification: 'tNO',
            U_MRNo: mr.DocEntry,
            U_PrjCode: mr.U_PrjCode || '',
            U_PrjDesc: mr.U_PrjDesc || '',
            U_OEM_UID: mr.U_OEM_UID ?? null,
            U_OEM_UEMAIL: mr.U_OEM_UEMAIL ?? null,
            U_OEM_UName: mr.U_OEM_UName ?? null,
            U_PreparedBy: mr.U_PreparedBy ?? null,
            DocumentLines: lines.map((line) => ({
                ItemCode: line.U_ItmSerCode,
                ItemDescription: line.U_ItemDesc,
                U_HLB_FullDesc: line.U_SerDesc,
                Quantity: Number(line.U_ReqQty) || 0,
                ProjectCode: line.U_Project,
                WarehouseCode: line.U_Whs,
                UoMCode: line.U_UOM,
                U_MRDocEntry: mr.DocEntry,
                U_MRLine: line.LineId,
                RequiredDate: line.U_ReqDate || null,
                U_HLB_Rmarks: line.U_HLB_Rmarks
            }))
        };
    }

    async finalizeApproval(req, mr, remark) {
        const patchPayload = { U_DocStatus: 'O' };
        if (remark !== undefined && remark !== null) patchPayload.U_Apr_remark = remark;

        const data = await this.patch(req, mr.DocEntry, patchPayload);

        const prPayload = this.buildPRPayloadFromMR(mr);
        let purchaseRequest;

        if (!prPayload.DocumentLines.length) {
            purchaseRequest = { created: false, error: 'No eligible lines to create a Purchase Request' };
        } else {
            try {
                const pr = await this.purchaseRequestService.create(req, prPayload);
                purchaseRequest = { created: true, docEntry: pr?.DocEntry, docNum: pr?.DocNum };
            } catch (prError) {
                const sapMessage = prError.response?.data?.error?.message?.value || prError.message;
                console.error('Auto Purchase Request creation failed for MR', mr.DocEntry, sapMessage);
                purchaseRequest = { created: false, error: sapMessage };
            }
        }

        return { data, purchaseRequest };
    }

}

module.exports = MaterialRequestService;
