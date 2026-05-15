const SAPClient = require("./SAPClient");
class SapBaseService {

    constructor(){
        this.sapClient = new SAPClient();
    }

    async getAll(req, module, query = {}) {
        const response = await this.sapClient.getAll(
            req,
            module,
            query
        );

        return response.data?.value || response.data;
    }

    async getById(req, module, id) {
        const response = await this.sapClient.getById(
            req,
            module,
            id
        );

        return response.data;
    }

    async create(req, module, payload) {
        const response = await this.sapClient.create(
            req,
            module,
            payload
        );

        return response.data;
    }

    async patch(req, module, id, payload) {
        const response = await this.sapClient.patch(
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