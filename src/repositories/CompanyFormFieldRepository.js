const BaseRepository = require("./baseRepository");
const { Form, FormSection, Company, CompanyFormField } = require('../models');

class CompanyFormFieldRepository extends BaseRepository {

    constructor(){
        super(CompanyFormField)
    }

    async findAll() {
        return await this.model.findAll({
            attributes: {
            exclude: ['formId', 'formSectionId', 'FormId', 'FormSectionId', 'companyId', 'CompanyId']
            },
            include: [Form, FormSection, Company]
        });
    }

    async findById(id) {
        return await this.model.findByPk(id, {
            attributes: {
            exclude: ['formId', 'formSectionId', 'FormId', 'FormSectionId', 'companyId', 'CompanyId']
            },
            include: [Form, FormSection, Company]
        });
    }

}

module.exports = CompanyFormFieldRepository;