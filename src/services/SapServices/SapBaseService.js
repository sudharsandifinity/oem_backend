const SAPClient = require("./SAPClient");
class SapBaseService {

    constructor(){
        this.sapClient = new SAPClient();
    }

    async getEmployeeDetail(req, id) {
        const response = await this.sapClient.getEmployee(req, id);
        return response.data;
    }

    async getBranches(req) {
        const response = await this.sapClient.Branches(req);
        return response.data.value;
    }

}

module.exports = SapBaseService;