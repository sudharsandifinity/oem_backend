const BaseRepository = require("./baseRepository");
const { CompanyForm, Company, Form } = require('../models');

class CompanyFormRepository extends BaseRepository {

    constructor(){
        super(CompanyForm);
    }

    async findAll(){
        return await this.model.findAll({ include: [Company, Form] });
    }

    async findById(id){
        return await this.model.findByPk(id, { include: [Company, Form] });
    }

}

module.exports = CompanyFormRepository;