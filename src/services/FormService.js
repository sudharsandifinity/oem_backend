const logger = require("../config/logger");
const { encodeId } = require("../utils/hashids");
const BaseService = require("./baseService");

class FormService extends BaseService{

    constructor(FormRepository){
        super(FormRepository)
    }

    async create(data){
        const existing = await this.repository.findByName(data.name);

        if(existing) {
            logger.warn('Form name is already exists', {Name: data.name});
            throw new Error('Form name is already exist!');
        }

        const form = await this.repository.create(data);
        const json = form.toJSON();
        json.id = encodeId(json.id)
        return json;
    }

    async update(id, data) {
        if (data.name) {
            const existing = await this.repository.findByName(data.name);
            if (existing && existing.id != id) {
                logger.warn('Form name is already exists', {Name: data.name});
                throw new Error('Form name is already exist!');
            }
        }
        return await this.repository.update(id, data);
    }

}

module.exports = FormService;