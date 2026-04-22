const SAPClient = require("./SAPClient");
class SapBaseService {

    constructor(){
        this.sapClient = new SAPClient();
    }

    async getEmployeeDetail(req, id) {
        const response = await this.sapClient.getEmployee(req, id);
        return response.data;
    }

}

module.exports = SapBaseService;