const SapBaseController = require("./SapBaseController");
const MaterialRequestService = require('../../services/SapServices/MaterialRequestService');
const { userService } = require("../../routes/v1/admin/userRoutes");

class MaterialRequestController extends SapBaseController {

    constructor() {
        super(new MaterialRequestService());
        this.materialRequestService = new MaterialRequestService();
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
            const { skip = '', top = '' } = req.query || {};

            const response = await this.service.getAll(req, {
                orderBy: 'DocEntry desc',
                filter: "U_DocStatus eq 'D'",
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
            return res.status(200).json(response);
        } catch (error) {
            return this.errorCatch(req, res, 'Error while updating approval', error);
        }
    }

    approve = this.decide('O');
    reject  = this.decide('R');

}

module.exports = MaterialRequestController;
