const logger = require("../config/logger");
const { encodeId, decodeId } = require("../utils/hashids");
const BaseService = require("./baseService");

class FromFieldService extends BaseService{

    constructor(FromFieldRepository){
        super(FromFieldRepository)
    }

    async getAll(){
        const formFields = await this.repository.findAll();

        return formFields.map(formField => {
            const json = formField.toJSON();
            json.id = encodeId(json.id);

            if(json.Form){
                json.Form.id = encodeId(json.Form.id)
            }
            if(json.FormSection){
                json.FormSection.id = encodeId(json.FormSection.id)
            }
            return json;
        })
    }

    async getById(id){
        const data = await this.repository.findById(id);
        if (!data) return null;
        const result = data.toJSON();
        result.id = encodeId(result.id);
        result.Form.id = encodeId(result.Form.id);
        result.FormSection.id = encodeId(result.FormSection.id);
        return result;
    }

    async create(data){

        if(data.formId){
            data.formId = decodeId(data.formId)
        }

        if(data.formSectionId){
            data.formSectionId = decodeId(data.formSectionId)
        }

        const FormField = await this.repository.create(data);
        const result = await this.getById(FormField.id)
        return result;
    }

    async update(id, data){
        if (data.formId) {
            data.formId = decodeId(data.formId);
        }
        if (data.formSectionId) {
            data.formSectionId = decodeId(data.formSectionId);
        }
        
        const item = await this.repository.update(id, data);
        const result = await this.getById(item.id)
        return result;
    }

}

module.exports = FromFieldService;