const SapBaseController = require("./SapBaseController");
const MaterialRequestService = require('../../services/SapServices/MaterialRequestService');
const PurchaseRequestService = require('../../services/SapServices/PurchaseRequestService');
const PurchaseOrderService = require('../../services/SapServices/PurchaseOrderService');
const PurchaseDeliveryNoteService = require('../../services/SapServices/PurchaseDeliveryNoteService');
const { userService } = require("../../routes/v1/admin/userRoutes");

class MaterialRequestController extends SapBaseController {

    constructor() {
        super(new MaterialRequestService());
        this.materialRequestService = new MaterialRequestService();
        this.purchaseRequestService = new PurchaseRequestService();
        this.purchaseOrderService = new PurchaseOrderService();
        this.purchaseDeliveryNoteService = new PurchaseDeliveryNoteService();
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

    projectBasedFilter = async (req, res) => {
        try {
            const userdetails = await userService.getById(req.user.id);

            const userProjects = userdetails.Projects.map(
                project => project.Code
            );

            if(!userProjects.length){
                return res.status(200).json('No data found!');
            }

            const projectFilter = userProjects.length
                ? userProjects.map(code => `U_PrjCode eq '${code}'`).join(' or ')
                : "";

            const {
                select = "",
                filter = projectFilter,
                orderBy = "DocEntry desc",
                skip = "",
                top = ""
            } = req.query || {};

            const query = {
                orderBy,
                select,
                filter: filter,
                skip,
                top
            };

            const response = await this.service.getAll(
                req,
                query
            );

            return res.status(200).json(response);

        } catch (error) {

            return this.errorCatch(
                req,
                res,
                'Error while fetching records',
                error
            );
        }
    }

    getMaterialRqs = async (req, res) => {
        try {
            const { skip = 0, top = 20 } = req.query || {};

            const qry = {};
            qry.skip = skip;
            qry.top = top;
    
            const response = await this.materialRequestService.getMRs(req, qry);
            res.status(200).json(response);
        } catch (error) {
            const message = "Error while fetching Material Requisations"
            return this.errorCatch(req, res, message, error);
        }
    }

        create = async (req, res) => {
        try {
            req.body.U_DocStatus = 'D';
            const response = await this.service.create(req, req.body);
            return res.status(201).json(response);
        } catch (error) {
            return this.errorCatch(req, res, 'Error while creating record', error);
        }
    }

    getPendingApprovals = async (req, res) => {
        try {
            const userdetails = await userService.getById(req.user.id);
            const projectCodes = (userdetails.Projects || []).map(p => p.Code);

            if (!projectCodes.length) {
                return res.status(200).json({ value: [] });
            }

            const projectFilter = projectCodes
                .map(code => `U_PrjCode eq '${code}'`)
                .join(' or ');

            const { skip = '', top = '' } = req.query || {};

            const response = await this.service.getAll(req, {
                orderBy: 'DocEntry desc',
                filter: `(${projectFilter})`,
                skip,
                top,
                count: true
            });

            return res.status(200).json(response);
        } catch (error) {
            return this.errorCatch(req, res, 'Error while fetching approvals', error);
        }
    }

        getPendingApprovalReport = async (req, res) => {
        try {
            const userdetails = await userService.getById(req.user.id);
            const projectCodes = (userdetails.Projects || []).map(p => p.Code);

            if (!projectCodes.length) {
                return res.status(200).json({ value: [] });
            }

            const projectFilter = projectCodes
                .map(code => `U_PrjCode eq '${code}'`)
                .join(' or ');

            const { skip = '', top = '' } = req.query || {};

            const response = await this.service.getAll(req, {
                orderBy: 'DocEntry desc',
                // filter: `(${projectFilter}) and U_DocStatus eq 'D'`,
                filter: `U_OEM_UEMAIL eq '${req.user.email}' and U_DocStatus eq 'D'`,
                skip,
                top,
                count: true
            });

            return res.status(200).json(response);
        } catch (error) {
            return this.errorCatch(req, res, 'Error while fetching pending approval report', error);
        }
    }

    _fetchByAnyValue = async (req, service, field, values, { quote = false } = {}) => {
        const unique = [...new Set(values.filter((v) => v !== null && v !== undefined && v !== ''))];
        if (!unique.length) return [];

        const chunkSize = 20;
        const all = [];
        for (let i = 0; i < unique.length; i += chunkSize) {
            const chunk = unique.slice(i, i + chunkSize);
            const filter = chunk.map((v) => `${field} eq ${quote ? `'${v}'` : v}`).join(' or ');
            const resp = await service.getAll(req, { filter, top: chunkSize });
            (resp?.value || []).forEach((row) => all.push(row));
        }
        return all;
    }

    _indexFirstBy = (rows, key) => {
        const map = {};
        for (const row of rows) {
            const k = row[key];
            if (k !== null && k !== undefined && map[k] === undefined) map[k] = row;
        }
        return map;
    }

    getPendingDeliveryReport = async (req, res) => {
        try {
            const email = req.user.email;

            const mrResp = await this.service.getAll(req, {
                orderBy: 'DocEntry desc',
                filter: `U_OEM_UEMAIL eq '${email}' and U_DocStatus eq 'O'`,
                top: 200
            });
            const mrs = mrResp?.value || [];
            if (!mrs.length) return res.status(200).json({ value: [] });

            const mrEntries = mrs.map((m) => m.DocEntry);

            const prs = await this._fetchByAnyValue(req, this.purchaseRequestService, 'U_MRNo', mrEntries, { quote: true });
            const pos = await this._fetchByAnyValue(req, this.purchaseOrderService, 'U_MRNo', mrEntries, { quote: true });

            const prByMR = this._indexFirstBy(prs, 'U_MRNo');
            const poByMR = this._indexFirstBy(pos, 'U_MRNo');

            const poEntries = pos.map((p) => String(p.DocEntry));
            const grpos = await this._fetchByAnyValue(req, this.purchaseDeliveryNoteService, 'U_PONo', poEntries);
            const grpoByPO = this._indexFirstBy(grpos, 'U_PONo');

            const rows = [];
            for (const mr of mrs) {
                const pr = prByMR[mr.DocEntry] || null;
                const po = poByMR[mr.DocEntry] || null;
                const grpo = po ? grpoByPO[String(po.DocEntry)] || null : null;

                let status;
                if (!pr) status = 'PR Pending';
                else if (!po) status = 'PO Pending';
                else if (po.DocumentStatus === 'bost_Close') status = 'Completed';
                else if (!grpo) status = 'Delivery Pending';
                else status = 'Partially Delivered';

                rows.push({
                    mrDocEntry: mr.DocEntry,
                    prDocEntry: pr?.DocEntry ?? null,
                    poDocEntry: po?.DocEntry ?? null,
                    grpoDocEntry: grpo?.DocEntry ?? null,
                    projectCode: mr.U_PrjCode ?? '',
                    projectName: mr.U_PrjDesc ?? '',
                    requiredDate: mr.U_ReqDate ?? null,
                    supplierCode: po?.CardCode ?? grpo?.CardCode ?? '',
                    supplierName: po?.CardName ?? grpo?.CardName ?? '',
                    status
                });
            }

            return res.status(200).json({ value: rows });
        } catch (error) {
            return this.errorCatch(req, res, 'Error while fetching pending delivery report', error);
        }
    }

        decide = (newStatus) => async (req, res) => {
        try {
            const { id } = req.params;

            const mr = await this.service.getById(req, id, {});
            if (mr.U_DocStatus !== 'D') {
                return res.status(409).json({ message: 'Only draft requests can be actioned' });
            }

            const userdetails = await userService.getById(req.user.id);
            const projectCodes = (userdetails.Projects || []).map(p => p.Code);
            if (!projectCodes.includes(mr.U_PrjCode)) {
                return res.status(403).json({ message: 'You are not assigned to this project' });
            }

            const { U_Apr_remark } = req.body || {};
            const patchPayload = { U_DocStatus: newStatus };
            if (U_Apr_remark !== undefined) patchPayload.U_Apr_remark = U_Apr_remark;

            const response = await this.service.patch(req, id, patchPayload);

            if (newStatus === 'O') {
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
                        console.error('Auto Purchase Request creation failed for MR', id, sapMessage);
                        purchaseRequest = { created: false, error: sapMessage };
                    }
                }

                return res.status(200).json({ data: response, purchaseRequest });
            }

            return res.status(200).json(response);
        } catch (error) {
            return this.errorCatch(req, res, 'Error while updating approval', error);
        }
    }

    approve = this.decide('O');
    reject  = this.decide('R');

}

module.exports = MaterialRequestController;
