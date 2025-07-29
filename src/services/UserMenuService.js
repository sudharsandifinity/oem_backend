const { decodeId, encodeId } = require("../utils/hashids");
const BaseService = require("./baseService");


class UserMenuService extends BaseService{

    constructor(UserMenuRepository){
        super(UserMenuRepository);
    }

    async getAll(){
        const userMenus = await this.repository.findAll();

        return userMenus.map(userMenu => {
            const json = userMenu.toJSON();
            json.id = encodeId(json.id);
            json.parent = encodeId(json.parent);
            return json;
        })
    }

    async getById(id){
        const userMenu = await this.repository.findById(id);
        if(!userMenu) return null;
        const result = userMenu.toJSON();
        result.id = encodeId(result.id);
        result.parent = encodeId(result.parent);
        return result;
    }

    async create(data){

        if(data.parent){
            data.parent = decodeId(data.parent)
        }

        const userMenu = await this.repository.create(data);
        const result = await this.getById(userMenu.id)
        return result;
    }

    async update(id, data){
        
        if(data.parent){
            data.parent = decodeId(data.parent)
        }
        
        const item = await this.repository.update(id, data);
        const result = await this.getById(item.id)
        return result;
    }

}

module.exports = UserMenuService;