const logger = require("../config/logger");
const BaseService = require("./baseService");

class FormSectionService extends BaseService{

    constructor(FormSectionRepository){
        super(FormSectionRepository)
    }

    async create(data){
        const existing = await this.repository.findByName(data.section_name);

        if(existing) {
            logger.warn('Form Section name is already exists', {Name: data.section_name});
            throw new Error('Form Section name is already exist!');
        }

        const form_section = await this.repository.create(data);
        const json = form_section.toJSON();
        json.id = encodeId(json.id)
        return json;
    }

    async update(id, data) {
        if (data.section_name) {
            const existing = await this.repository.findByName(data.section_name);
            if(existing) {
                logger.warn('Form Section name is already exists', {Name: data.section_name});
                throw new Error('Form Section name is already exist!');
            }
        }
        return await this.repository.update(id, data);
    }

}

module.exports = FormSectionService;