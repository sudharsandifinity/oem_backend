const { decodeId, encodeId } = require("../utils/hashids");
const { usermenu } = require("../utils/usermenu");
const BaseService = require("./baseService");
const { Form, FormField } = require("../models")


class UserMenuService extends BaseService{

    constructor(UserMenuRepository){
        super(UserMenuRepository);
    }

    async getAll() {
        const userMenus = await this.repository.findAll();

        const menuTree = usermenu(userMenus);

        const encodeMenuTree = (menuItem) => {
            menuItem.id = encodeId(menuItem.id);
            menuItem.parentUserMenuId = encodeId(menuItem.parentUserMenuId);
            menuItem.companyId = encodeId(menuItem.companyId);
            menuItem.branchId = encodeId(menuItem.branchId);
            menuItem.formId = encodeId(menuItem.formId);

            if (menuItem.Form) {
            menuItem.Form.id = encodeId(menuItem.Form.id);
            menuItem.Form.parentFormId = encodeId(menuItem.Form.parentFormId);
            menuItem.Form.companyId = encodeId(menuItem.Form.companyId);
            menuItem.Form.branchId = encodeId(menuItem.Form.branchId);

            if (Array.isArray(menuItem.Form.FormFields)) {
                menuItem.Form.FormFields = menuItem.Form.FormFields.map(field => {
                field.id = encodeId(field.id);
                field.formId = encodeId(field.formId);
                field.formSectionId = encodeId(field.formSectionId);
                return field;
                });
            }
            }

            if (Array.isArray(menuItem.children)) {
            menuItem.children = menuItem.children.map(child => encodeMenuTree(child));
            }

            return menuItem;
        };

        return menuTree.map(menuItem => encodeMenuTree(menuItem));
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