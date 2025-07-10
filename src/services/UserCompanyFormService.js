const { decodeId, encodeId } = require("../utils/hashids");
const BaseService = require("./baseService");

class UserCompanyFormService extends BaseService{

    constructor(userCompanyFormRepository){
        super(userCompanyFormRepository)
    }

    async getById(id){
        const userCompanyForm = await this.repository.findById(id);
        if(!userCompanyForm) return null;
        const result = userCompanyForm.toJSON();
        result.id = encodeId(result.id);
        if(result.User){
            result.User.id = encodeId(result.User.id);
        }
        if(result.CompanyFormField){
            result.CompanyFormField.id = encodeId(result.CompanyFormField.id);
            result.CompanyFormField.companyId = encodeId(result.CompanyFormField.companyId);
            result.CompanyFormField.formId = encodeId(result.CompanyFormField.formId);
            result.CompanyFormField.formSectionId = encodeId(result.CompanyFormField.formSectionId);
        }
        return result;
    }

    async create(data){

        if(data.companyFormFieldId){
            data.companyFormFieldId = decodeId(data.companyFormFieldId)
        }

        if(data.userId){
            data.userId = decodeId(data.userId)
        }

        const userCompanyForm = await this.repository.create(data);
        const result = await this.getById(userCompanyForm.id)
        return result;
    }

    async update(id, data){
        
        if(data.companyFormFieldId){
            data.companyFormFieldId = decodeId(data.companyFormFieldId)
        }
        
        if (data.userId) {
            data.userId = decodeId(data.userId);
        }
        
        const item = await this.repository.update(id, data);
        const result = await this.getById(item.id)
        return result;
    }

}

module.exports = UserCompanyFormService;