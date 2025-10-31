const { encodeId } = require("../utils/hashids");
const BaseService = require("./baseService");


class FormDataService extends BaseService{

    constructor(FormDataRepository){
        super(FormDataRepository)
    }

    async create(data) {
        if (typeof data.data === 'object') {
            data.data = JSON.stringify(data.data);
        }
        const item = await this.repository.create(data);
        const result = item.toJSON();
        result.id = encodeId(result.id);
        if (result.data) result.data = JSON.parse(result.data);
        return result;
    }

}

module.exports = FormDataService;