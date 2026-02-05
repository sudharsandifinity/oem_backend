const {Endpoints, SAP_QUERIES} = require('../utils/sapEndPoints');
const { sapGetRequest, sapPostRequest, sapPatchRequest } = require('../utils/sapRequestMethods');

class SAPClient {

    async getEmployees(req, { top = 20, skip = 0 }) {
        return await sapGetRequest(
            req,
            `${Endpoints.Employees}?${Endpoints.EmployeesSelect}&$orderby=EmployeeID desc&$top=${top}&$skip=${skip}`
        );
    }

    async getLeaveType(req, EmpId) {
        return await sapGetRequest(
            req,
            `${Endpoints.LeaveType}?$select =INPR_ECI5Collection &$filter=Code eq '${EmpId}'`
        );
    }

    async getEmployee(req, id ) {
        console.log('id', id);
        
        return await sapGetRequest(
            req,
            `${Endpoints.Employees}(${id})?${Endpoints.EmployeesSelect}`
        );
    }

    // dtynamic

    async getReqByEmp(req, EmpId, { endpoint, top = 20, skip = 0 }) {
        return await sapGetRequest(
            req,
            `${endpoint}?${Endpoints.OrderByDocEntry}&${SAP_QUERIES.FilByUempId}'${EmpId}'&$top=${top}&$skip=${skip}`
        );
    }

    async getReqById(req, endpoint, docEntry ) {
        console.log('docEntry', docEntry);
        return await sapGetRequest(
            req,
            `${endpoint}(${docEntry})`
        );
    }

    async createRq(req, endpoint, payload) {
        console.log('req payload', endpoint, payload);
        return await sapPostRequest( req, endpoint, payload );
    }

    async patchRq(req, endpoint, docEntry, payload) {
        console.log('patch docEntry', docEntry);
        console.log('req patch payload', payload);
        
        return await sapPatchRequest(
            req,
            `${endpoint}(${docEntry})`,
            payload
        );
    }

// ----------------------------------------

    async attendance(req, EmpId){
        console.log('att empid', EmpId);
        return await sapGetRequest(
            req,
            `${Endpoints.Attendance}?${SAP_QUERIES.FilByUempId}'${EmpId}'`
        );
    }

    async checkApprovalLevels(req, position, model) {
        console.log('position', position);
        console.log('model', model);
        return await sapGetRequest(
            req,
            `${Endpoints.ApprovalLevels}?${SAP_QUERIES.ApprovalLvFilter}'${position}' AND ${model} eq 'Y'`
        );
    }

    async getExpReq(req) {
        return await sapGetRequest(
            req,
            `${Endpoints.Expanses}?${SAP_QUERIES.OrderByDocEntry}`
        );
    }

    async getAtts(req) {
        return await sapGetRequest(
            req,
            `${Endpoints.Attachments}?${SAP_QUERIES.OrderByAbsoluteEntry}`
        );
    }

    async getAtt(req, id) {
        return await sapGetRequest(
            req,
            `${Endpoints.Attachments}(${id})`
        );
    }

    async createAtt(req, data, header) {
        return await sapPostRequest(
            req,
            `${Endpoints.Attachments}`,
            data,
            header
        );
    }

    async createTravelExp(req, payload) {
        console.log('tr payload', payload);
        return await sapPostRequest(
            req,
            `${Endpoints.TravelExp}`,
            payload
        );
    }

    async createOTR(req, payload) {
        console.log('otr payload', payload);
        return await sapPostRequest(
            req,
            `${Endpoints.OTR}`,
            payload
        );
    }

    async createLv(req, payload) {
        console.log('lv payload', payload);
        return await sapPostRequest(
            req,
            `${Endpoints.Leave}`,
            payload
        );
    }

    async createAPInvoice(req, payload) {
        console.log('purcha invoice payload', payload);
        const response = await sapPostRequest(
            req,
            `${Endpoints.APInvoice}`,
            payload
        );
        return response.data
    }

    async addLogEntry(req, payload) {
        console.log('[payload', payload);
        return await sapPostRequest(
            req,
            `${Endpoints.AllLogEntries}`,
            payload
        );
    }

    async getAprLogs(req, EmpId, {top = 20, skip = 0}) {
        return await sapGetRequest(
            req,
            `${Endpoints.AllLogEntries}?${SAP_QUERIES.OrderByCode}&$filter=U_AppId eq '${EmpId}' or U_DelID eq '${EmpId}'&$top=${top}&$skip=${skip}`
        );
    }

    async getEmpLogs(req, EmpId) {
        return await sapGetRequest(
            req,
            `${Endpoints.AllLogEntries}?${SAP_QUERIES.OrderByCode}&$filter=U_ReqID eq '${EmpId}'`
        );
    }

    async getLog(req, id ) {
        console.log('id', id);
        
        return await sapGetRequest(
            req,
            `${Endpoints.AllLogEntries}(${id})`
        );
    }

    async getRequestLogs(req, col ) {
        console.log('log col', col);
        
        return await sapGetRequest(
            req,
            `${Endpoints.AllLogEntries}?${SAP_QUERIES.LogFilterByReq} '${col.U_DocNo}' and U_DocType eq '${col.U_DocType}'`
        );
    }

    async patchLog(req, code, payload) {
        console.log('code', code);
        console.log('code payload', payload);
        
        return await sapPatchRequest(
            req,
            `${Endpoints.AllLogEntries}(${code})`,
            payload
        );
    }

    async getTExpanses(req) {
        return await sapGetRequest(
            req,
            `${Endpoints.TravelExp}?${SAP_QUERIES.OrderByDocEntry}`
        );
    }

    async getAllLv(req) {
        return await sapGetRequest(
            req,
            `${Endpoints.Leave}?${SAP_QUERIES.OrderByDocEntry}`
        );
    }

    async getAllOT(req) {
        return await sapGetRequest(
            req,
            `${Endpoints.OTR}?${SAP_QUERIES.OrderByDocEntry}`
        );
    }

    async getTExpByEmp(req, EmpId, { top = 20, skip = 0 }) {
        return await sapGetRequest(
            req,
            `${Endpoints.TravelExp}?${Endpoints.OrderByDocEntry}&${SAP_QUERIES.FilByUempId}'${EmpId}'&$top=${top}&$skip=${skip}`
        );
    }

    async getTORByEmp(req, EmpId, { top = 20, skip = 0 }) {
        return await sapGetRequest(
            req,
            `${Endpoints.OTR}?${Endpoints.OrderByDocEntry}&${SAP_QUERIES.FilByUempId}'${EmpId}'&$top=${top}&$skip=${skip}`
        );
    }

    async getLvByEmp(req, EmpId, { top = 20, skip = 0 }) {
        return await sapGetRequest(
            req,
            `${Endpoints.Leave}?${Endpoints.OrderByDocEntry}&${SAP_QUERIES.FilByUempId}'${EmpId}'&$top=${top}&$skip=${skip}`
        );
    }

    async getTExpanse(req, docEntry ) {
        console.log('docEntry', docEntry);
        
        return await sapGetRequest(
            req,
            `${Endpoints.TravelExp}(${docEntry})`
        );
    }

    async getOTR(req, docEntry ) {
        console.log('docEntry', docEntry);
        return await sapGetRequest(
            req,
            `${Endpoints.OTR}(${docEntry})`
        );
    }

    async getLvRq(req, docEntry ) {
        console.log('docEntry', docEntry);
        return await sapGetRequest(
            req,
            `${Endpoints.Leave}(${docEntry})`
        );
    }

    async patchTExpanse(req, docEntry, payload) {
        console.log('docEntry', docEntry);
        console.log('texp docEntry', payload);
        
        return await sapPatchRequest(
            req,
            `${Endpoints.TravelExp}(${docEntry})`,
            payload
        );
    }

    async patchOTR(req, docEntry, payload) {
        console.log('docEntry', docEntry);
        console.log('otr patch payload', payload);
        
        return await sapPatchRequest(
            req,
            `${Endpoints.OTR}(${docEntry})`,
            payload
        );
    }

    async patchLv(req, docEntry, payload) {
        console.log('docEntry', docEntry);
        console.log('leave patch payload', payload);
        
        return await sapPatchRequest(
            req,
            `${Endpoints.Leave}(${docEntry})`,
            payload
        );
    }


    async vendorPayment(req, payload){
        return await sapPostRequest(
            req,
            `${Endpoints.VendorPayment}`,
            payload
        );
    }

}

module.exports = SAPClient;