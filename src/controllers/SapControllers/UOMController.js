const UOMService = require('../../services/SapServices/UOMService');
const SapDocumentController = require("./SapDocumentController");

class UOMController extends SapDocumentController {

    constructor() {
        super(new UOMService());
    }

    getAll = async (req, res) => {
        try {
            const { select = "", filter = "", orderBy = "", skip = "", top = "", count = true } = req.query || {};
            const query = {
                orderBy,
                select,
                filter,
                skip,
                top,
                count
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

}

module.exports = UOMController;