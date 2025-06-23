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
        const item = await this.repository.update(id, data);
        const result = item.toJSON();
        result.id = encodeId(item.id)
        result.companyId = encodeId(item.companyId)
        return result;
    }

}

module.exports = BranchService;