const { encodeId } = require("../utils/hashids");
const BaseService = require("./baseService");

class CompanyFormDataService extends BaseService {

    constructor(CompanyFormDataRepository){
        super(CompanyFormDataRepository)
    }

    async getAll(){
        const formDatas = await this.repository.findAll();

        return formDatas.map(formData => {
            const json = formData.toJSON();
            json.id = encodeId(json.id);

            if(json.CompanyForm){
                json.CompanyForm.id = encodeId(json.CompanyForm.id)
            }

            if(json.CompanyForm.Form){
                json.CompanyForm.Form.id = encodeId(json.CompanyForm.Form.id)
            }
            if(json.CompanyForm.Company){
                json.CompanyForm.Company.id = encodeId(json.CompanyForm.Company.id)
            }

            return json;
        })
    }

    async getById(id){
        const data = await this.repository.findById(id);
        if (!data) return null;
        const result = data.toJSON();
        result.id = encodeId(result.id);
        result.CompanyForm.id = encodeId(result.CompanyForm.id);
        result.CompanyForm.Company.id = encodeId(result.CompanyForm.Company.id);
        result.CompanyForm.Form.id = encodeId(result.CompanyForm.Form.id);
        return result;
    }

    // async create(data){

    //     if(data.companyId){
    //         data.companyId = decodeId(data.companyId)
    //     }

    //     if(data.formId){
    //         data.formId = decodeId(data.formId)
    //     }

    //     if(data.formSectionId){
    //         data.formSectionId = decodeId(data.formSectionId)
    //     }

    //     const FormField = await this.repository.create(data);
    //     const result = await this.getById(FormField.id)
    //     return result;
    // }

    // async update(id, data){
    //     if(data.companyId){
    //         data.companyId = decodeId(data.companyId)
    //     }
        
    //     if (data.formId) {
    //         data.formId = decodeId(data.formId);
    //     }
    //     if (data.formSectionId) {
    //         data.formSectionId = decodeId(data.formSectionId);
    //     }
        
    //     const item = await this.repository.update(id, data);
    //     const result = await this.getById(item.id)
    //     return result;
    // }

}

module.exports = CompanyFormDataService;