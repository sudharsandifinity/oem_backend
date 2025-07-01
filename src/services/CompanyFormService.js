const { encodeId, decodeId } = require("../utils/hashids");
const BaseService = require("./baseService");

class CompanyFormService extends BaseService {

    constructor(CompanyFormRepository){
        super(CompanyFormRepository);
    }

    async getAll(){
        const datas = await this.repository.findAll();
        return datas.map((data) => {
            const json = data.toJSON();
            json.companyId = encodeId(json.companyId);
            json.formId = encodeId(json.formId);
            if(json.Company){
                json.Company.id = encodeId(json.Company.id)
            }
            if(json.formId){
                json.Form.id = encodeId(json.Form.id)
            }
            return json;
        })
    }

    async create(data){
        
        if (data.companyId) {
            data.companyId = decodeId(data.companyId);
        }

        if (data.formId) {
            data.formId = decodeId(data.formId);
        }

        const item = await this.repository.create(data);
        const result = item.toJSON();
        result.id = encodeId(result.id);
        result.companyId = encodeId(result.companyId);
        result.formId = encodeId(result.formId);
        return result;
    }

    async update(id, data){
        if (data.companyId) {
            data.companyId = decodeId(data.companyId);
        }
        if (data.formId) {
            data.formId = decodeId(data.formId);
        }
        
        const item = await this.repository.update(id, data);
        const result = item.toJSON();
        result.id = encodeId(item.id)
        result.companyId = encodeId(item.companyId)
        result.formId = encodeId(item.formId)
        return result;
    }

}



module.exports = CompanyFormService;