const BaseRepository = require("./baseRepository");
const { CompanyFormData, CompanyForm, Company, Form } = require('../models');

class CompanyFormDataRepository extends BaseRepository {

    constructor(){
        super(CompanyFormData)
    }

    async findAll() {
        return await this.model.findAll({
            attributes: {
                exclude: ['companyFormId']
            },
            include: [
                {
                    model: CompanyForm,
                    attributes: {
                        exclude: ['formId', 'companyId']
                    },
                    include: [Company, Form]
                }
            ]
        });
    }

    async findById(id) {
        return await this.model.findByPk(id, {
            attributes: {
            exclude: ['companyFormId']
            },
            include: [
                {
                    model: CompanyForm,
                    attributes: {
                        exclude: ['formId', 'companyId']
                    },
                    include: [Company, Form]
                }
            ]
        });
    }


}

module.exports = CompanyFormDataRepository