const SapBaseController = require("./SapBaseController");
const BOQService = require('../../services/SapServices/BOQService');


class BOQController extends SapBaseController {

    constructor(){
        super()
        this.boqService = new BOQService();
    }

    getOpenBoqs = async (req, res) => {
        try {
            const qry = {
                filter: "$filter=U_Status eq 'open'"
            }
            const response = await this.boqService.getOpenBOQs(req, qry);
            res.status(200).json(response);
        } catch (error) {
            const message = "Error while fetching BOQs"
            return this.errorCatch(req, res, message, error);
        }
    }


}

module.exports = BOQController;
