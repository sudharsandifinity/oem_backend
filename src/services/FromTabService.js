const logger = require("../config/logger");
const { encodeId, decodeId } = require("../utils/hashids");
const BaseService = require("./baseService");

class FromTabService extends BaseService{

    constructor(FromTabRepository){
        super(FromTabRepository)
    }

    async getAll(){
        const formTabs = await this.repository.findAll();

        return formTabs.map(formTab => {
            const json = formTab.toJSON();
            json.id = encodeId(json.id);
            json.formId = encodeId(json.formId);
            return json;
        })
    }

    async getById(id){
        const data = await this.repository.findById(id);
        if (!data) return null;
        const result = data.toJSON();
        result.id = encodeId(result.id);
        result.formId = encodeId(result.formId);
        return result;
    }

    async create(data){

        if(data.formId){
            data.formId = decodeId(data.formId)
        }

        const FormTab = await this.repository.create(data);
        const result = await this.getById(FormTab.id)
        return result;
    }

    async update(id, data){
        if (data.formId) {
            data.formId = decodeId(data.formId);
        }
        
        const item = await this.repository.update(id, data);
        const result = await this.getById(item.id)
        return result;
    }

}

module.exports = FromTabService;