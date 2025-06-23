const { sendEmail, sendBranchAssignEmail } = require('../config/mail');
const { encodeId, decodeId } = require('../utils/hashids');
const BaseService = require('./baseService');

class UserService extends BaseService {
  
    constructor(userRepository){
        super(userRepository)
    }

    async getAll(){
        const users = await this.repository.findAll();

        return users.map(user => {
            const json = user.toJSON();
            console.log('users', json);
            
            json.id = encodeId(json.id);
            json.roleId = encodeId(json.roleId);

            if (json.Role) {
                json.Role.id = encodeId(json.Role.id);
            }
            if (json.Branches) {
                json.Branches = json.Branches.map((branch) => ({
                    ...branch,
                    id: encodeId(branch.id),
                    companyId: encodeId(branch.CompanyId),
                    CompanyId: encodeId(branch.CompanyId),
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
        if(result.Role){
            result.Role.id = encodeId(result.Role.id);
        }
        if(result.Branches){
            result.Branches = result.Branches.map((branch) => ({
                ...branch,
                id: encodeId(branch.id)
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
        if(data.branchIds?.length){
            const branchIdsArray = data.branchIds.map((permission) => {
                return decodeId(permission);
            })
            await user.setBranches(branchIdsArray);
        }

        const userData = await this.repository.findById(user.id);
        const mailDesign = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8" />
            <title>Branch Assignment</title>
            <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f9f9f9;
                margin: 0;
                padding: 0;
            }
            .container {
                background-color: #ffffff;
                padding: 20px;
                margin: 30px auto;
                max-width: 600px;
                border: 1px solid #e0e0e0;
                border-radius: 6px;
            }
            .header {
                font-size: 20px;
                margin-bottom: 20px;
                color: #333333;
            }
            .content {
                font-size: 16px;
                color: #555555;
                line-height: 1.6;
            }
            .footer {
                margin-top: 30px;
                font-size: 14px;
                color: #999999;
            }
            </style>
        </head>
        <body>
            <div class="container">
            <div class="header">Branch Assignment Notification</div>
            <div class="content">
                Hi ${userData.first_name} ${userData.last_name},<br /><br />
                You have been assigned to the following branch:<br /><br />
                ${
                    userData?.Branches.map((branch) => (
                        `<span>${branch.name} </span>`
                    ))
                }
                
            </div><br />
            <div class="footer">
                Thanks & Regards,<br />
                Admin<br />
            </div>
            </div>
        </body>
        </html>`

        await sendBranchAssignEmail(userData.email, "Branch Assignment", mailDesign);
        const json = userData.toJSON();
        json.id = encodeId(json.id);

        if(json.Role){
            json.Role.id = encodeId(json.Role.id)
        }
        if(json.Branches){
            json.Branches = json.Branches.map((branch) => ({
                ...branch,
                id: encodeId(branch.id)
            }))
        }
        return json;
    }

    async update(id, data) {
       if(data.roleId){
            data.roleId = decodeId(data.roleId)
        }
        if (data.email) {
            const existing = await this.repository.findByEmail(data.email);
            if (existing && existing.id != id) {
                throw new Error('Email already exists');
            }
        }
        const user = await this.repository.findById(id);
        if(!user) throw new Error('user not found!');
        await this.repository.update(id, data);

        if(data.branchIds?.length){
            const branchIdsArray = data.branchIds.map((permission) => {
                return decodeId(permission);
            })
            // const assignedBranches = branchIdsArray.map((branch) => {
            //     return Branch.findById(branch);
            // })
            await user.setBranches(branchIdsArray);
        }

        const userData = await this.repository.findById(id);

        const mailDesign = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8" />
            <title>Branch Assignment</title>
            <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f9f9f9;
                margin: 0;
                padding: 0;
            }
            .container {
                background-color: #ffffff;
                padding: 20px;
                margin: 30px auto;
                max-width: 600px;
                border: 1px solid #e0e0e0;
                border-radius: 6px;
            }
            .header {
                font-size: 20px;
                margin-bottom: 20px;
                color: #333333;
            }
            .content {
                font-size: 16px;
                color: #555555;
                line-height: 1.6;
            }
            .footer {
                margin-top: 30px;
                font-size: 14px;
                color: #999999;
            }
            </style>
        </head>
        <body>
            <div class="container">
            <div class="header">Branch Assignment Notification</div>
            <div class="content">
                Hi ${userData.first_name} ${userData.last_name},<br /><br />
                You have been assigned to the following branch:<br /><br />
                ${
                    userData?.Branches.map((branch) => (
                        `<span>${branch.name} </span>`
                    ))
                }
                
            </div><br />
            <div class="footer">
                Thanks & Regards,<br />
                Admin<br />
            </div>
            </div>
        </body>
        </html>`

        await sendBranchAssignEmail(userData.email, "Branch Assignment", mailDesign);
        const json = userData.toJSON();
        json.id = encodeId(json.id);

        if(json.Role){
            json.Role.id = encodeId(json.Role.id)
        }
        if(json.Branches){
            json.Branches = json.Branches.map((branch) => ({
                ...branch,
                id: encodeId(branch.id)
            }))
        }
        return json;
    }

}

module.exports = UserService;