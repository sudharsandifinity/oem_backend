const { encodeId, decodeId } = require("../utils/hashids");

class BaseService {

    constructor(repository){
        this.repository = repository;
    }

    async getAll(){
        const datas = await this.repository.findAll();
        return datas.map((data) => {
            const json = data.toJSON();
            json.id = encodeId(json.id);

            return json;
        })
    }

    async getById(id){
        const data = await this.repository.findById(id);
        if (!data) return null;
        const result = data.toJSON();
        result.id = encodeId(result.id);
        return result;
    }

    async create(data){
        const item = await this.repository.create(data);
        const result = item.toJSON();
        result.id = encodeId(result.id);
        return result;
    }

    async update(id, data){
        const item = await this.repository.update(id, data);
        const result = item.toJSON();
        result.id = encodeId(item.id)
        return result;
    }

    async delete(id){
        const decodedId = decodeId(id);
        return await this.repository.delete(decodedId)
    }

}

module.exports = BaseService;