const BaseRepository = require("./baseRepository");
const { Company, Branch } = require('../models');


class CompanyRepository extends BaseRepository{

    constructor(){
        super(Company);
    }

    async findAll(){
        return await this.model.findAll({ include: Branch });
    }

    async findCompanyCode(company_code){
        return await this.model.findOne({where: {company_code}});
    }


}

module.exports = CompanyRepository;