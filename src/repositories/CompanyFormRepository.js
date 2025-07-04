const BaseRepository = require("./baseRepository");
const { CompanyForm, Company, Form } = require('../models');

class CompanyFormRepository extends BaseRepository {

    constructor(){
        super(CompanyForm);
    }

    async findAll() {
        return await this.model.findAll({
            attributes: {
            exclude: ['formId', 'companyId', 'FormId', 'CompanyId']
            },
            include: [Company, Form]
        });
    }

    async findById(id){
        return await this.model.findByPk(id, {
            attributes: {
                exclude: ['formId', 'companyId', 'FormId', 'CompanyId']
            },
            include: [Company, Form] 
        });
    }

}

module.exports = CompanyFormRepository;