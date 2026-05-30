const { Endpoints } = require('../../utils/sapEndPoints');
const {
    sapGetRequest,
    sapPostRequest,
    sapPatchRequest
} = require('../../utils/sapRequestMethods');
const buildQueryString = require('../../utils/buildSapQuery');

class SAPBaseClient {

    async getAll(req, module, query = {}) {
        const queryString = buildQueryString(query);
        return await sapGetRequest(
            req,
            `${Endpoints[module]}${queryString}`
        );
    }

    async getById(req, module, id, query = {}) {
        const queryString = buildQueryString(query);
        return await sapGetRequest(
            req,
            `${Endpoints[module]}(${id})${queryString}`
        );
    }

    async create(req, module, payload) {

        return await sapPostRequest(
            req,
            Endpoints[module],
            payload
        );
    }

    async patch(req, module, id, payload) {

        return await sapPatchRequest(
            req,
            `${Endpoints[module]}(${id})`,
            payload
        );
    }
}

module.exports = SAPBaseClient;