const SapBaseController = require("./SapBaseController");
const MaterialRequestService = require('../../services/SapServices/MaterialRequestService');
const PurchaseRequestService = require('../../services/SapServices/PurchaseRequestService');
const { userService } = require("../../routes/v1/admin/userRoutes");

class MaterialRequestController extends SapBaseController {

    constructor() {
        super(new MaterialRequestService());
        this.materialRequestService = new MaterialRequestService();
        this.purchaseRequestService = new PurchaseRequestService();
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
                filter: `(${projectFilter}) and U_DocStatus eq 'D'`,
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
