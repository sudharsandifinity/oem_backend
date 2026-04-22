const BaseRepository = require("./baseRepository");
const { Company, Branch, SapBranch } = require('../models');


class CompanyRepository extends BaseRepository{

    constructor(){
        super(Company);
    }

    async findAll(){
        return await this.model.findAll({ include: [{model: SapBranch, as: 'branches'}] });
    }

    async findAllActive(){
        return await this.model.findAll(
            {
                where: {status:1},
                attributes: ['id', 'name', 'company_code']
            }
        );
    }

    async findById(id){
        return await this.model.findByPk(id, { include: [{model: SapBranch, as: 'branches'}] });
    }

    async findCompanyCode(company_code){
        return await this.model.findOne({where: {company_code}});
    }


}

module.exports = CompanyRepository;