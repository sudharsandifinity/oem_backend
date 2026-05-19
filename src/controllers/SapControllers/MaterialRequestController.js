const SapBaseController = require("./SapBaseController");
const MaterialRequestService = require('../../services/SapServices/MaterialRequestService');
const { userService } = require("../../routes/v1/admin/userRoutes");

class MaterialRequestController extends SapBaseController {

    constructor() {
        super(new MaterialRequestService(), "MR");
        this.materialRequestService = new MaterialRequestService();
    }

    projectBasedFilter = async (req, res) => {
        try {
            const userdetails = await userService.getById(req.user.id);

            const userProjects = userdetails.Projects.map(
                project => project.Code
            );

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
                this.module,
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

}

module.exports = MaterialRequestController;
