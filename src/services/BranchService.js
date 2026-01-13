const {logger} = require("../config/logger");
const { encodeId, decodeId } = require("../utils/hashids");
const BaseService = require("./baseService");


class BranchService extends BaseService{

    constructor(BranchRepository){
        super(BranchRepository)
    }

    async getAll(){
        const branches = await this.repository.findAll();

        return branches.map(branch => {
            const json = branch.toJSON();
            json.id = encodeId(json.id);
            json.companyId = encodeId(json.companyId)

            if(json.Company){
                json.Company.id = encodeId(json.Company.id)
            }
            return json;
        })
    }

    async getById(id){
        const company = await this.repository.findById(id);
        if(!company) return null;
        const result = company.toJSON();
        result.id = encodeId(result.id);
        if(result.Company){
            result.Company.id = encodeId(result.Company.id);
        }
        return result;
    }

    async create(data){
        const existing = await this.repository.findByName(data.name);
        if(existing) {
            logger.warn('Breanch name is already exists', {Name: data.name});
            throw new Error('Branch name is already exist!');
        }

        const branchCode = await this.repository.findBranchCode(data.branch_code);
        if(branchCode) {
            logger.warn('Breanch Code is already exists', {Code: data.branch_code});
            throw new Error('Branch Code is already exist!');
        }
        
        if (data.companyId) {
            data.companyId = decodeId(data.companyId);
        }

        const item = await this.repository.create(data);
        const result = item.toJSON();
        result.id = encodeId(result.id);
        result.companyId = encodeId(result.companyId);
        return result;
    }

    async update(id, data){

        if (data.companyId) {
            data.companyId = decodeId(data.companyId);
        }
        if (data.name) {
            const existing = await this.repository.findByName(data.name);
            if (existing && existing.id != id) {
                logger.warn('Branch name is already exists', {Name: data.name});
                throw new Error('Branch name is already exist!');
            }
        }
        if (data.branch_code) {
            const existing_code = await this.repository.findBranchCode(data.branch_code);
            if(existing_code && existing_code.id != id) {
                logger.warn('Branch Code is already exists', {BranchCode: data.branch_code});
                throw new Error('Branch Code is already exist!');
            }
        }
        const item = await this.repository.update(id, data);        
        const result = await this.getById(item.id);
        return result;
    }

}

module.exports = BranchService;