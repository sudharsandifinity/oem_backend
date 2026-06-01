const SAPClient = require("./SAPClient");
const SAPBaseClient = require("./SAPBaseClient");
class SapBaseService {

    constructor(module){
        this.sapClient = new SAPClient();
        this.sapBaseClient = new SAPBaseClient(module);
    }

    async getAll(req, query = {}) {
        const response = await this.sapBaseClient.getAll(
            req,
            query
        );

        return response?.data;
    }

    async getById(req, id, query) {
        const response = await this.sapBaseClient.getById(
            req,
            id,
            query
        );

        return response.data;
    }

    async create(req, payload) {
        const response = await this.sapBaseClient.create(
            req,
            payload
        );

        return response.data;
    }

    async patch(req, id, payload) {
        const response = await this.sapBaseClient.patch(
            req,
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