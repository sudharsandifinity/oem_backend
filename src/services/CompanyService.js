const logger = require("../config/logger");
const { encodeId } = require("../utils/hashids");
const BaseService = require("./baseService");

class CompanyService extends BaseService{

    constructor(companyRepository){
        super(companyRepository)
    }

    async getAll(){
        const datas = await this.repository.findAll();
        return datas.map((data) => {
            const json = data.toJSON();
            json.id = encodeId(json.id);
            if(json.Branches){
                json.Branches = json.Branches.map((branch) => ({
                    ...branch,
                    id: encodeId(branch.id)
                }))
            }
            return json;
        })
    }

    async create(data){
        const existing = await this.repository.findByName(data.name);
        const existing_code = await this.repository.findCompanyCode(data.company_code);

        if(existing) {
            logger.warn('Company name is already exists', {Name: data.name});
            throw new Error('Company name is already exist!');
        }

        if(existing_code) {
            logger.warn('Company Code is already exists', {Name: data.company_code});
            throw new Error('Company Code is already exist!');
        }

        const company = await this.repository.create(data);
        const json = company.toJSON();
        json.id = encodeId(json.id)
        return json;
    }

    async update(id, data) {
        if (data.name) {
            const existing = await this.repository.findByName(data.name);
            if (existing && existing.id != id) {
                logger.warn('Company name is already exists', {Name: data.name});
                throw new Error('Company name is already exist!');
            }
        }
        if (data.company_code) {
            const existing_code = await this.repository.findCompanyCode(data.company_code);
            if(existing_code) {
                logger.warn('Company Code is already exists', {Name: data.company_code});
                throw new Error('Company Code is already exist!');
            }
        }
        return await this.repository.update(id, data);
    }

}

module.exports = CompanyService;