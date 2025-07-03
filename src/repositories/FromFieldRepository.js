const BaseRepository = require("./baseRepository");
const { Form, FormSection, FormField } = require('../models');

class FromFieldRepository extends BaseRepository {

    constructor(){
        super(FormField)
    }

    async findAll() {
        return await this.model.findAll({
            attributes: {
            exclude: ['formId', 'formSectionId', 'FormId', 'FormSectionId']
            },
            include: [Form, FormSection]
        });
    }

    async findByName(field_name){
        return await this.model.findOne({ where: { field_name }});
    }

    async findById(id) {
        return await this.model.findByPk(id, {
            attributes: {
            exclude: ['formId', 'formSectionId', 'FormId', 'FormSectionId']
            },
            include: [Form, FormSection]
        });
    }

}

module.exports = FromFieldRepository;