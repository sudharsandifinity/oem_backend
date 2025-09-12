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
            json.companyId = encodeId(json.companyId);
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
        result.companyId = encodeId(result.companyId);
        if (result.Permissions) {
            result.Permissions = result.Permissions.map((permi) => ({
                ...permi,
                id: encodeId(permi.id)
            }));
        }
        if (result.UserMenus) {
            result.UserMenus = result.UserMenus.map((menu) => ({
                ...menu,
                id: encodeId(menu.id),
                parentUserMenuId: encodeId(menu.parentUserMenuId),
                companyId: encodeId(menu.companyId),
                branchId: encodeId(menu.branchId),
                formId: encodeId(menu.formId)
            }));
        }
        return result;
    }

    async create(data) {
        const sequelize = this.repository.model.sequelize;
        const t = await sequelize.transaction();

        try {
            data.companyId = decodeId(data.companyId);

            const existing = await this.repository.findByName(data.name);
            if (existing) {
            throw new Error('Role name already exists!');
            }

            const role = await this.repository.create(data, { transaction: t });

            if (data.scope === 'master' && Array.isArray(data.permissionIds)) {
            const permissionIds = data.permissionIds.map(decodeId);
            await role.setPermissions(permissionIds, { transaction: t });
            }

            if (data.scope === 'user' && Array.isArray(data.userMenuIds)) {
            const userMenuIds = data.userMenuIds.map(decodeId);
            await role.setUserMenus(userMenuIds, { transaction: t });
            }
            await t.commit();
            return await this.getById(role.id);

        } catch (error) {
            await t.rollback();
            throw new Error(`${error.message}`);
        }
    }

    async update(id, data) {
        const sequelize = this.repository.model.sequelize;
        const t = await sequelize.transaction();

        try {
            if (data.companyId) {
            data.companyId = decodeId(data.companyId);
            }

            if (data.name) {
            const existing = await this.repository.findByName(data.name);
            if (existing && existing.id != id) {
                throw new Error('Role name already exists!');
            }
            }

            const role = await this.repository.findById(id);
            if (!role) throw new Error('Role not found');

            await this.repository.update(id, data, { transaction: t });

            if (data.scope === 'master' && Array.isArray(data.permissionIds)) {
            const permissionIds = data.permissionIds.map(decodeId);
            await role.setPermissions(permissionIds, { transaction: t });
            }

            if (data.scope === 'user' && Array.isArray(data.userMenuIds)) {
            const userMenuIds = data.userMenuIds.map(decodeId);
            await role.setUserMenus(userMenuIds, { transaction: t });
            }

            await t.commit();

            return await this.getById(id);

        } catch (error) {

            await t.rollback();
            throw new Error(`${error.message}`);
        }
    }


}

module.exports = RoleService;