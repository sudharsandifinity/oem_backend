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
            json.parentUserMenuId = encodeId(json.parentUserMenuId);
            json.companyId = encodeId(json.companyId);
            json.branchId = encodeId(json.branchId);
            json.formId = encodeId(json.formId);

            if (json.Form) {
                json.Form.id = encodeId(json.Form.id);
            }

            return json;
        })
    }

    async getById(id){
        const userMenu = await this.repository.findById(id);
        if(!userMenu) return null;
        const result = userMenu.toJSON();
        result.id = encodeId(result.id);
        result.parentUserMenuId = encodeId(result.parentUserMenuId);
        result.companyId = encodeId(result.companyId);
        result.branchId = encodeId(result.branchId);
        result.formId = encodeId(result.formId);
        if (result.Form) {
            result.Form.id = encodeId(result.Form.id);
        }

        return result;
    }

    async create(data){

        ["companyId", "branchId", "parentUserMenuId", "formId"].forEach(key => {
            if (data[key] === "" || data[key] === undefined) {
                data[key] = null;
            }
        });

        ["companyId", "branchId", "parentUserMenuId", "formId"].forEach(key => {
            if(data[key]){
                data[key] = decodeId(data[key]);
            }
        });

        const userMenu = await this.repository.create(data);
        const result = await this.getById(userMenu.id)
        return result;
    }

    async update(id, data){
        
        ["companyId", "branchId", "parentUserMenuId", "formId"].forEach(key => {
            if (data[key] === "" || data[key] === undefined) {
                data[key] = null;
            }
        });

        ["companyId", "branchId", "parentUserMenuId", "formId"].forEach(key => {
            if(data[key]){
                data[key] = decodeId(data[key]);
            }
        });
        
        const item = await this.repository.update(id, data);
        const result = await this.getById(item.id)
        return result;
    }

}

module.exports = UserMenuService;