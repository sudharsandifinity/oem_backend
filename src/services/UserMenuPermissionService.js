const logger = require("../config/logger");
const { encodeId, decodeId } = require("../utils/hashids");
const BaseService = require("./baseService");

class UserMenuPermissionService extends BaseService{

    constructor(UserMenuPermissionRepository){
        super(UserMenuPermissionRepository)
    }

    async getAll(){
        const userMenuPermissions = await this.repository.findAll();

        return userMenuPermissions.map(userMenuPermission => {
            const json = userMenuPermission.toJSON();
            json.id = encodeId(json.id);
            json.userMenuId = encodeId(json.userMenuId);

            if(json.menu){
                json.menu.id = encodeId(json.menu.id)
            }
            return json;
        })
    }

    async getById(id){
        const data = await this.repository.findById(id);
        if (!data) return null;
        const result = data.toJSON();
        result.id = encodeId(result.id);
        result.userMenuId = encodeId(result.userMenuId);
        result.menu.id = encodeId(result.menu.id);
        return result;
    }

    async create(data){

        if(data.userMenuId){
            data.userMenuId = decodeId(data.userMenuId)
        }

        const FormField = await this.repository.create(data);
        const result = await this.getById(FormField.id)
        return result;
    }

    async update(id, data){
        
        if(data.userMenuId){
            data.userMenuId = decodeId(data.userMenuId)
        }
        
        const item = await this.repository.update(id, data);
        const result = await this.getById(item.id)
        return result;
    }

}

module.exports = UserMenuPermissionService;