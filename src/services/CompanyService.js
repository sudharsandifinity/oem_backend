const {logger} = require("../config/logger");
const { encrypt } = require("../utils/crypto");
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
                    id: encodeId(branch.id),
                    companyId: encodeId(branch.companyId)
                }))
            }
            return json;
        })
    }

    async getActiveList(){
        const datas = await this.repository.findAllActive();
        return datas.map((data) => {
            const json = data.toJSON();
            json.id = encodeId(json.id);
            return json;
        })
    }

    async getById(id){
        const company = await this.repository.findById(id);
        if(!company) return null;
        const result = company.toJSON();
        result.id = encodeId(result.id);
        if(result.Branches){
            result.Branches = result.Branches.map((branch) => ({
                ...branch,
                id: encodeId(branch.id),
                companyId: encodeId(branch.companyId)
            }))
        }
        return result;
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

        if(data.sap_username){
            data.sap_username = encrypt(data.sap_username)
        }

        if(data.secret_key){
            data.secret_key = encrypt(data.secret_key)
        }

        const company = await this.repository.create(data);
        const result = await this.getById(company.id);
        return result;
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
            if(existing_code && existing_code.id != id) {
                logger.warn('Company Code is already exists', {Name: data.company_code});
                throw new Error('Company Code is already exist!');
            }
        }

        if(data.sap_username){
            data.sap_username = encrypt(data.sap_username)
        }

        if(data.secret_key){
            data.secret_key = encrypt(data.secret_key)
        }

        const company = await this.repository.update(id, data);
        const result = await this.getById(company.id);
        return result;
    }

}

module.exports = CompanyService;