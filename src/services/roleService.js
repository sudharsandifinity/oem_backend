const { decodeId, encodeId } = require("../utils/hashids");
const BaseService = require("./baseService");


class RoleService extends BaseService{

    constructor(roleRepository){
        super(roleRepository);
    }

    async getAll(){
        const datas = await this.repository.findAll();
        return datas.map((data) => {
            const json = data.toJSON();
            json.id = encodeId(json.id);
            json.Permissions.map((permission) => {
                permission.id = encodeId(permission.id)
            })
            return json;
        })
    }

    async getById(id){
        const role = await this.repository.findById(id);
        if(!role) return null;
        const result = role.toJSON();
        result.id = encodeId(result.id);
        if (result.Permissions) {
            result.Permissions = result.Permissions.map((permi) => ({
                ...permi,
                id: encodeId(permi.id)
            }));
        }
        return result;
    }

    async create(data){
        const existing = await this.repository.findByName(data.name);
        if(existing) throw new Error('Role name is already Exist!');

        const role = await this.repository.create(data);
        if(data.permissionIds?.length){
            const permissionIdsArray = data.permissionIds.map((permission) => {
                return decodeId(permission);
            })
            await role.setPermissions(permissionIdsArray);
        }
        
        const roleData = await this.getById(role.id);
        return roleData;
    }

    async update(id, data){
        if(data.name){
            const existing = await this.repository.findByName(data.name);
            if(existing && existing.id != id){
                throw new Error('Role name is already Exist!');
            }
        }
        const role = await this.repository.findById(id);
        if (!role) throw new Error('Role not found');

        await this.repository.update(id, data)

        if (data.permissionIds) {
            if (data.permissionIds) {
                const rawPermissionIds = data.permissionIds.map(decodeId);
                await role.setPermissions(rawPermissionIds);
            }
        }

        const updatedData = await this.getById(id);
        return updatedData;
    }

}

module.exports = RoleService;