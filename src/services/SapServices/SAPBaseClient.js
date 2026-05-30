const { Endpoints } = require('../../utils/sapEndPoints');
const {
    sapGetRequest,
    sapPostRequest,
    sapPatchRequest
} = require('../../utils/sapRequestMethods');
const buildQueryString = require('../../utils/buildSapQuery');

class SAPBaseClient {

    constructor(module) {
        this.endpoint = Endpoints[module];
    }

    async getAll(req, query = {}) {
        console.log('qqqr', query);
        
        const queryString = buildQueryString(query);
        return await sapGetRequest(
            req,
            `${this.endpoint}${queryString}`
        );
    }

    async getById(req, id, query = {}) {
        const queryString = buildQueryString(query);
        return await sapGetRequest(
            req,
            `${this.endpoint}(${id})${queryString}`
        );
    }

    async create(req, payload) {

        return await sapPostRequest(
            req,
            this.endpoint,
            payload
        );
    }

    async patch(req, id, payload) {

        return await sapPatchRequest(
            req,
            `${this.endpoint}(${id})`,
            payload
        );
    }
}

module.exports = SAPBaseClient;