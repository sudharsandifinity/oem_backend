const SapBaseSetvice = require("./SapBaseService");
const SAPService = new require('../SAPService');


class BOQService extends SapBaseSetvice {

    constructor(){
        super()
    }

    async getOpenBOQs(req, qry) {
        const response = await this.sapClient.GetBOQs(req, qry);
        return response.data.value;
    }

}

module.exports = BOQService;