const SapBaseSetvice = require("./SapBaseService");
const SAPService = new require('../SAPService');


class MaterialRequestService extends SapBaseSetvice {

    constructor(){
        super();
    }

    async getMRs(req, qry) {
        const response = await this.sapClient.GetAllMRs(req, qry);
        return response.data.value;
    }

}

module.exports = MaterialRequestService;