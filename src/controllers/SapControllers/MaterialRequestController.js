const SapBaseController = require("./SapBaseController");
const MaterialRequestService = require('../../services/SapServices/MaterialRequestService');
const PurchaseRequestService = require('../../services/SapServices/PurchaseRequestService');
const PurchaseOrderService = require('../../services/SapServices/PurchaseOrderService');
const PurchaseDeliveryNoteService = require('../../services/SapServices/PurchaseDeliveryNoteService');
const ApprovalService = require('../../services/ApprovalService');
const UserRepository = require('../../repositories/userRepository');
const { userService } = require("../../routes/v1/admin/userRoutes");

class MaterialRequestController extends SapBaseController {

    constructor() {
        super(new MaterialRequestService());
        this.materialRequestService = new MaterialRequestService();
        this.purchaseRequestService = new PurchaseRequestService();
        this.purchaseOrderService = new PurchaseOrderService();
        this.purchaseDeliveryNoteService = new PurchaseDeliveryNoteService();
        this.approvalService = new ApprovalService();
        this.userRepository = new UserRepository();
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
            console.log(
                'MR lines payload:',
                JSON.stringify(
                    (req.body.HLB_MRQ1Collection || []).map((l) => ({
                        item: l.U_ItmSerCode,
                        U_BOMEntry: l.U_BOMEntry,
                        U_BOMLine: l.U_BOMLine,
                        U_MRQty: l.U_MRQty,
                        U_ReqQty: l.U_ReqQty
                    }))
                )
            );
            const response = await this.service.create(req, req.body);

            try {
                const companyIds = await this.userRepository.getUserCompanyIds(req.user.id);
                await this.approvalService.initiate(req, {
                    companyId: companyIds[0] ?? null,
                    docType: 'MR',
                    docEntry: response?.DocEntry,
                    createdByUserId: req.user.id
                });
            } catch (initErr) {
                console.error('Approval initiate failed for MR', response?.DocEntry, initErr.message);
            }

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

                if (po && po.DocumentStatus === 'bost_Close') continue;

                let status;
                if (!pr) status = 'PR Pending';
                else if (!po) status = 'PO Pending';
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

}

module.exports = MaterialRequestController;
