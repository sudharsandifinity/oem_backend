const {logger} = require("../config/logger");
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

    async create(data) {

        if (Array.isArray(data)) {

            const results = [];

            for (const tab of data) {
                let payload = { ...tab };

                const created = await this.repository.create(payload);
                const result = await this.getById(created.id);

                results.push(result);
            }

            return results;
        }

        if (data.formId) {
            data.formId = decodeId(data.formId);
        }

        const createdTab = await this.repository.create(data);
        return await this.getById(createdTab.id);
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