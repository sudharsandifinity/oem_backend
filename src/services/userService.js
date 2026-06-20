const { Op } = require('sequelize');
const { sendEmail, sendBranchAssignEmail } = require('../config/mail');
const { UserBranch, UserRole, Company, UserMenu, Branch } = require('../models');
const { encodeId, decodeId } = require('../utils/hashids');
const BaseService = require('./baseService');
const { usermenu } = require('../utils/usermenu');

class UserService extends BaseService {

    constructor(userRepository){
        super(userRepository)
    }

    async _assignBranches(user, data) {
        const branchIdsArray = (data.branchIds || []).map((b) => decodeId(b));
        const companyIdsArray = (data.companyIds || []).map((c) => decodeId(c));
        if (!branchIdsArray.length && !companyIdsArray.length) return;

        const where = {};
        if (branchIdsArray.length && companyIdsArray.length) {
            where[Op.or] = [{ id: { [Op.in]: branchIdsArray } }, { companyId: { [Op.in]: companyIdsArray } }];
        } else if (branchIdsArray.length) {
            where.id = { [Op.in]: branchIdsArray };
        } else {
            where.companyId = { [Op.in]: companyIdsArray };
        }

        const branches = await Branch.findAll({ where, attributes: ['id', 'companyId'] });

        await UserBranch.destroy({ where: { userId: user.id } });
        await UserBranch.bulkCreate(branches.map((branch) => ({
            userId: user.id,
            branchId: branch.id,
            companyId: branch.companyId
        })));
    }

    async getAll(){
        const users = await this.repository.findAll();

        return users.map(user => {
            const json = user.toJSON();
            
            json.id = encodeId(json.id);

            if(json.Roles){
                json.Roles = json.Roles.map((role) => ({
                ...role,
                id: encodeId(role.id),
                companyId: encodeId(role.companyId),
                Permissions: role.Permissions.map((permission) => ({
                    ...permission,
                    id: encodeId(permission.id)
                }))
            }))
            };
            if (json.Branches) {
                json.Branches = json.Branches.map((branch) => ({
                    ...branch,
                    id: encodeId(branch.id),
                    companyId: encodeId(branch.CompanyId),
                    Company: {
                        ...branch.Company,
                        id: encodeId(branch.Company.id)
                    }
                }));
            }

            return json;
        });
        
    }

    async getById(id){
        const user = await this.repository.findById(id);
        if(!user) return null;
        const result = user.toJSON();
        result.id = encodeId(result.id);
        if(result.Roles){
            result.Roles = result.Roles.map((role) => ({
            ...role,
            id: encodeId(role.id),
            companyId: encodeId(role.companyId),
            Permissions: role.Permissions.map((permission) => ({
                ...permission,
                id: encodeId(permission.id)
            })),
            UserMenus: role.UserMenus.map((usermenu) => ({
                ...usermenu,
                id: encodeId(usermenu.id),
                parentUserMenuId: encodeId(usermenu.parentUserMenuId),
                companyId: encodeId(usermenu.companyId),
                branchId: encodeId(usermenu.branchId),
                formId: encodeId(usermenu.formId),
            })),
        }));

        }
        if(result.Branches){
            result.Branches = result.Branches.map((branch) => ({
                ...branch,
                id: encodeId(branch.id),
                companyId: encodeId(branch.companyId),
                Company: {
                    ...branch.Company,
                    id: encodeId(branch.Company.id)
                }
            }))
        }
         if(result.Projects){
            result.Projects = result.Projects.map((project) => ({
                ...project,
                id: encodeId(project.id),
            }))
        }
        return result;
    }

    async create(data){
        if(data.roleId){
            data.roleId = decodeId(data.roleId)
        }
        const existing = await this.repository.findByEmail(data.email);
        if(existing) throw new Error('Email already exists');
        const user = await this.repository.create(data);
        if(data.roleIds?.length){
            const roleIdsArray = data.roleIds.map((role) => {
                return decodeId(role);
            })
            await user.setRoles(roleIdsArray);
        }
        await this._assignBranches(user, data);

        if(data.projectIds?.length){
            const projectIdsArray = data.projectIds.map((project) => {
                return decodeId(project);
            });

            await user.setProjects(projectIdsArray);
        }

        const userData = await this.repository.findById(user.id);

        // const mailDesign = `
        // <!DOCTYPE html>
        // <html>
        // <head>
        //     <meta charset="UTF-8" />
        //     <title>Branch Assignment</title>
        //     <style>
        //     body {
        //         font-family: Arial, sans-serif;
        //         background-color: #f9f9f9;
        //         margin: 0;
        //         padding: 0;
        //     }
        //     .container {
        //         background-color: #ffffff;
        //         padding: 20px;
        //         margin: 30px auto;
        //         max-width: 600px;
        //         border: 1px solid #e0e0e0;
        //         border-radius: 6px;
        //     }
        //     .header {
        //         font-size: 20px;
        //         margin-bottom: 20px;
        //         color: #333333;
        //     }
        //     .content {
        //         font-size: 16px;
        //         color: #555555;
        //         line-height: 1.6;
        //     }
        //     .footer {
        //         margin-top: 30px;
        //         font-size: 14px;
        //         color: #999999;
        //     }
        //     </style>
        // </head>
        // <body>
        //     <div class="container">
        //     <div class="header">Branch Assignment Notification</div>
        //     <div class="content">
        //         Hi ${userData.first_name} ${userData.last_name},<br /><br />
        //         You have been assigned to the following branch:<br /><br />
        //         ${
        //             userData?.Branches.map((branch) => (
        //                 `<span>${branch.name} </span>`
        //             ))
        //         }
                
        //     </div><br />
        //     <div class="footer">
        //         Thanks & Regards,<br />
        //         Admin<br />
        //     </div>
        //     </div>
        // </body>
        // </html>`

        // await sendBranchAssignEmail(userData.email, "Branch Assignment", mailDesign);
        const result = await this.getById(user.id);
        return result;
    }

    async update(id, data) {

        if (data.email) {
            const existing = await this.repository.findByEmail(data.email);
            if (existing && existing.id != id) {
                throw new Error('Email already exists');
            }
        }
        const user = await this.repository.findById(id);
        if(!user) throw new Error('user not found!');
        await this.repository.update(id, data);
        if(data.projectIds?.length){
            const projectIdsArray = data.projectIds.map((project) => {
                return decodeId(project);
            })
            await user.setProjects(projectIdsArray);
        }
        if(data.roleIds?.length){
            const roleIdsArray = data.roleIds.map((role) => {
                return decodeId(role);
            })
            await user.setRoles(roleIdsArray);
        }
        await this._assignBranches(user, data);

        const userData = await this.repository.findById(id);

        // const mailDesign = `
        // <!DOCTYPE html>
        // <html>
        // <head>
        //     <meta charset="UTF-8" />
        //     <title>Branch Assignment</title>
        //     <style>
        //     body {
        //         font-family: Arial, sans-serif;
        //         background-color: #f9f9f9;
        //         margin: 0;
        //         padding: 0;
        //     }
        //     .container {
        //         background-color: #ffffff;
        //         padding: 20px;
        //         margin: 30px auto;
        //         max-width: 600px;
        //         border: 1px solid #e0e0e0;
        //         border-radius: 6px;
        //     }
        //     .header {
        //         font-size: 20px;
        //         margin-bottom: 20px;
        //         color: #333333;
        //     }
        //     .content {
        //         font-size: 16px;
        //         color: #555555;
        //         line-height: 1.6;
        //     }
        //     .footer {
        //         margin-top: 30px;
        //         font-size: 14px;
        //         color: #999999;
        //     }
        //     </style>
        // </head>
        // <body>
        //     <div class="container">
        //     <div class="header">Branch Assignment Notification</div>
        //     <div class="content">
        //         Hi ${userData.first_name} ${userData.last_name},<br /><br />
        //         You have been assigned to the following branch:<br /><br />
        //         ${
        //             userData?.Branches.map((branch) => (
        //                 `<span>${branch.name} </span>`
        //             ))
        //         }
                
        //     </div><br />
        //     <div class="footer">
        //         Thanks & Regards,<br />
        //         Admin<br />
        //     </div>
        //     </div>
        // </body>
        // </html>`

        // await sendBranchAssignEmail(userData.email, "Branch Assignment", mailDesign);
        const result = await this.getById(user.id);
        return result;
    }

    async createSapUser(data){
        const user = await this.repository.create(data);
        if(data.roleIds?.length){
            const roleIdsArray = data.roleIds.map((role) => {
                return decodeId(role);
            })
            roleIdsArray.map(async role => {
                const payload = {
                    userId: user.id,
                    roleId: role
                }
                await UserRole.create(payload)
            })
        }
        if(data.branchIds?.length){
            // const branchIdsArray = data.branchIds.map((branch) => {
            //     return decodeId(branch);
            // })
            data.branchIds.map(async branch => {
                const payload = {
                    userId: user.id,
                    companyId: data.companyId,
                    branchId: branch,
                    sap_emp_id: data.sap_emp_id
                }
                await UserBranch.create(payload)
            })
        }
        return;
    }

    async updatesapemp(id, data) {
        const user = await this.repository.findById(id);
        if(!user) throw new Error('user not found!');
        // await this.repository.update(id, data);
        if(data.roleIds?.length){
            const roleIdsArray = data.roleIds.map((role) => {
                return decodeId(role);
            })
            roleIdsArray.map(async role => {
                const payload = {
                    userId: user.id,
                    roleId: role
                }
                await UserRole.create(payload)
            })
        }
        if(data.branchIds?.length){
            // const branchIdsArray = data.branchIds.map((branch) => {
            //     return decodeId(branch);
            // })
            data.branchIds.map(async branch => {
                const payload = {
                    userId: user.id,
                    companyId: data.companyId,
                    branchId: branch,
                    sap_emp_id: data.sap_emp_id
                }
                await UserBranch.create(payload)
            })
        }
        return;
    }

    async getCompanyUsers(userId) {
        const companyIds = await this.repository.getUserCompanyIds(userId);
        return await this.repository.getUsersByCompanies(companyIds);
    }

    async getAdminCompanies(userId) {
        const companyIds = await this.repository.getUserCompanyIds(userId);

        if (companyIds && companyIds.length > 0) {
            return await Company.findAll({
                where: {
                    id: { [Op.in]: companyIds }
                },
                attributes: ['id', 'name', 'company_code'],
                raw: true
            });
        } else {
            return [];
        }
    }

    async getByIdCA(userId) {
        const user = await this.repository.findByIdCA(userId);
        const json = user.toJSON();
        json.id = encodeId(json.id);
        if (json.Companies) {
            json.Companies = json.Companies.map((company) => ({
                ...company,
                id: encodeId(company.id)
            }));
        }

        if (json.Roles) {
            json.Roles = json.Roles.map((role) => ({

                ...role,

                id: encodeId(role.id),

                companyId: role.companyId
                    ? encodeId(role.companyId)
                    : null,

                UserMenus: role.UserMenus?.map((menu) => ({

                    ...menu,

                    id: encodeId(menu.id),

                    companyId: menu.companyId
                        ? encodeId(menu.companyId)
                        : null,

                    branchId: menu.branchId
                        ? encodeId(menu.branchId)
                        : null,

                    formId: menu.formId
                        ? encodeId(menu.formId)
                        : null,

                    parentUserMenuId: menu.parentUserMenuId
                        ? encodeId(menu.parentUserMenuId)
                        : null

                })) || []

            }));
        }

        if (json.Projects) {
            json.Projects = json.Projects.map((project) => ({
                ...project,
                id: encodeId(project.id)
            }));
        }

        return json;
    }

    async getCompanyMenus (userId) {
        const companyIds = await this.repository.getUserCompanyIds(userId);
            if (companyIds && companyIds.length > 0) {
                const userMenus = await UserMenu.findAll({
                where: {
                    companyId: { [Op.in]: companyIds },
                    status: 1
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
                raw: true
            });

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
        } else {
            return [];
        }
    }

}

module.exports = UserService;