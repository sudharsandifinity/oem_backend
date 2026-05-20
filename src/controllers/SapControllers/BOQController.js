const SapBaseController = require("./SapBaseController");
const BOQService = require('../../services/SapServices/BOQService');


class BOQController extends SapBaseController {

    constructor(){
        super()
        this.boqService = new BOQService();
    }

    getOpenBoqs = async (req, res) => {
        try {

            const { U_BPCode, U_PrjCode } = req.query;
            
            let filters = [`U_Status eq 'open'`];

            if (U_BPCode) {
                filters.push(`U_BPCode eq '${U_BPCode}'`);
            }

            if (U_PrjCode) {
                filters.push(`U_PrjCode eq '${U_PrjCode}'`);
            }

            const qry = {
                filter: filters.join(' and ')
            };

            const response = await this.boqService.getOpenBOQs(req, `$filter=${qry}`);

            return res.status(200).json(response);

        } catch (error) {
            const message = "Error while fetching BOQs";
            return this.errorCatch(req, res, message, error);
        }
    }


}

module.exports = BOQController;
