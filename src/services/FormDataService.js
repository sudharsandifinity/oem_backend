const { encodeId } = require("../utils/hashids");
const BaseService = require("./baseService");


class FormDataService extends BaseService{

    constructor(FormDataRepository){
        super(FormDataRepository)
    }

    async getAll() {
        const datas = await this.repository.findAll();
        return datas.map((data) => {
            const json = data.toJSON();
            json.id = encodeId(json.id);

            if (json.data) {
                try {
                    json.data = JSON.parse(json.data);
                } catch (e) {
                    console.warn("Invalid JSON in form data:", e);
                }
            }
            return json;
        });
    }

    async getById(id) {
        const data = await this.repository.findById(id);
        if (!data) return null;

        const result = data.toJSON();
        result.id = encodeId(result.id);

        if (result.data) {
            try {
                result.data = JSON.parse(result.data);
            } catch (e) {
                console.warn(`Failed to parse form data JSON for ID ${id}:`, e);
            }
        }

        return result;
    }

    async create(data) {
        if (typeof data.data === 'object') {
            data.data = JSON.stringify(data.data);
        }
        const item = await this.repository.create(data);
        const result = await this.getById(item.id);
        return result;
    }

    async update(id, data) {
        
        if (typeof data.data === "object") {
            data.data = JSON.stringify(data.data);
        }

        const updated = await this.repository.update(id, data);
        if (!updated) return null;

        const result = await this.getById(id);
        return result;
    }

}

module.exports = FormDataService;