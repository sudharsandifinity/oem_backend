const SAPClient = require("./SAPClient");
const SAPBaseClient = require("./SAPBaseClient");
class SapBaseService {

    constructor(){
        this.sapClient = new SAPClient();
        this.sapBaseClient = new SAPBaseClient();
    }

    async getAll(req, module, query = {}) {
        const response = await this.sapBaseClient.getAll(
            req,
            module,
            query
        );

        return response.data?.value || response.data;
    }

    async getById(req, module, id, query) {
        const response = await this.sapBaseClient.getById(
            req,
            module,
            id,
            query
        );

        return response.data;
    }

    async create(req, module, payload) {
        const response = await this.sapBaseClient.create(
            req,
            module,
            payload
        );

        return response.data;
    }

    async patch(req, module, id, payload) {
        const response = await this.sapBaseClient.patch(
            req,
            module,
            id,
            payload
        );

        return response.data;
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