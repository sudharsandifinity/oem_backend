const SapBaseController = require("./SapBaseController");
const ProjectService = require('../../services/SapServices/ProjectService')

class SapProjectController extends SapBaseController {

    constructor(){
        super(new ProjectService(), 'Projects')
    }

    getAll = async (req, res) => {
        try {

            const { select = "", filter = "", orderBy = "Code desc", skip = "", top = "" } = req.query || {};

            const query = {
                orderBy,
                select,
                filter,
                skip,
                top
            };

            const response = await this.service.getAll(
                req,
                this.module,
                query
            );

            return response;

        } catch (error) {

            return this.errorCatch(
                req,
                res,
                'Error while fetching records',
                error
            );
        }
    }
}

module.exports = SapProjectController;
