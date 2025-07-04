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
            json.id = encodeId(json.id);
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

    async getById(id){
        
        const data = await this.repository.findById(id);
        if (!data) return null;
        const result = data.toJSON();
        result.id = encodeId(result.id);
        result.Company.id = encodeId(result.Company.id);
        result.Form.id = encodeId(result.Form.id);
        return result;
    }

    async create(data){
        
        if (data.companyId) {
            data.companyId = decodeId(data.companyId);
        }

        if (data.formId) {
            data.formId = decodeId(data.formId);
        }

        const item = await this.repository.create(data);
        const result = await this.getById(item.id);
        return result;
    }

    async update(id, data){
        
        if (data.companyId) {
            data.companyId = decodeId(data.companyId);
        }
        
        if (data.formId) {
            data.formId = decodeId(data.formId);
        }
        
        await this.repository.update(id, data);
        const result = await this.getById(id);
        return result;
    }

}



module.exports = CompanyFormService;