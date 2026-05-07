const SapBaseController = require("./SapBaseController");
const MaterialRequestService = require('../../services/SapServices/MaterialRequestService');


class PayslipController extends SapBaseController {

    constructor(){
        super()
        this.materialRequestService = new MaterialRequestService();
    }

    getMaterialRqs = async (req, res) => {
        try {
            const { skip=0, top=20 } = req.body;
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

module.exports = PayslipController;
