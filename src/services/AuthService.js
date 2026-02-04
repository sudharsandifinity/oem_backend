const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SAPSession, User, Role, Permission, UserMenu, UserBranch, Branch, Company, Form, FormTab, SubForm, FormField } = require('../models');
const { sendEmail } = require('../config/mail');
const { encodeId, decodeId } = require("../utils/hashids");
const { usermenu, encodeUserMenu } = require('../utils/usermenu');
const axios = require('axios');
const https = require('https');
const { decrypt } = require('../utils/crypto');

class AuthService {

    async sapLogin(req, user=null) {
        // console.log('req', req.user);
        // console.log('user', user);
        const userValues = user ? await User.findByPk(user): "";
        const authUser = req.user ?? userValues.dataValues;
        // console.log('authuser', authUser);
        
        const companyId = req.body?.company_id;
        // console.log('companyidd', companyId);
        // console.log('body', req.body);
        
        // if(!companyId && !authUser.is_super_user){
        //     throw new Error ('Company ID is not found!');
        // }

        // console.log('user', authUser);

        const userData = await User.findOne({
            where: { email:authUser.email },
            include: [
                {
                model: Role,
                through: { attributes: [] },
                include: [
                    {
                        model: Permission,
                        through: { attributes: [] }
                    },
                    {
                        model: UserMenu,
                        include: [
                            {
                                model: Form,
                                include: [
                                    {
                                        model: FormTab,
                                        include: [{
                                            model: SubForm,
                                            include: [FormField]
                                        }],
                                    } 
                                ]
                            }
                        ],
                        attributes: { exclude: ['status', 'createdAt', 'updatedAt'] },
                        through: {
                            attributes: [
                            'can_list_view',
                            'can_create',
                            'can_edit',
                            'can_view',
                            'can_delete'
                            ]
                        },
                    }
                ]
                },
                {
                    model: Branch,
                    through: { attributes: [] },
                    attributes: {exclude: ['createdAt', 'updatedAt']},
                    through: {
                        attributes: ['sap_emp_id']
                    },
                    include: [
                        {
                            model: Company,
                            attributes: {exclude: ['createdAt', 'updatedAt']},
                        }
                    ]
                }
            ]
        });
        // const getCompany = userData.Branches.map(bch => bch.Company.id)
        // console.log('getCompany', getCompany);
        const decodedCompanyId = decodeId(companyId) ?? userData?.Branches?.[0]?.Company.id;
        console.log('decodedCompanyId', decodedCompanyId);
        if (typeof decodedCompanyId !== 'number' || isNaN(decodedCompanyId)) {
            throw new Error('Decoded company ID is invalid');
        }

        // if(!userData.is_super_user){
        //     const checkAcc = getCompany.find(id => id === decodedCompanyId);
        //     // console.log('checkAcc', checkAcc);
    
        //     if(!checkAcc){
        //         throw new Error("You dont have a access to login");
        //     }
        // }

        const company = await Company.findOne({where: {id: decodedCompanyId}, include: [
                        {
                            model: Branch,
                            attributes: {exclude: ['createdAt', 'updatedAt']},
                            include: [
                                {
                                model: UserBranch,
                                attributes: ['sap_emp_id']
                                }
                            ]
                        }
                    ]});
                    

        const companypassword = decrypt(company.secret_key)
        const companyusername = decrypt(company.sap_username).replace(/\\\\/g, "\\");
        // console.log('companyusername', companyusername);
        // console.log('companypassword', companypassword);

        const payload = {
            UserName: companyusername,
            Password: companypassword,
            CompanyDB: company.company_db_name
        };

        console.log('payload', payload);
        console.log('company', company.base_url);

        let response;

        try {
            response = response = await axios.post(
                `${company.base_url}/Login`,
                payload,
                    {
                        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
                        headers: { 'Content-Type': 'application/json' },
                        timeout: 10000,
                    }
            );
        } catch (err) {
            console.error(err?.response?.data || err.message);
            throw new Error ("SAP login failed!");
        }

        const sessionId = response.data.SessionId;
        const cookies = response.headers['set-cookie'];
        let routeId = '.node1';
        if (cookies && Array.isArray(cookies)) {
            const routeCookie = cookies.find(c => c.includes('ROUTEID'));
            if (routeCookie) {
                const match = routeCookie.match(/ROUTEID=([^;]+)/);
                if (match) routeId = match[1];
            }
        }
        
        await SAPSession.upsert({
            user_id: userData.id,
            sap_username: payload.UserName,
            company_db: payload.CompanyDB,
            b1_session: sessionId,
            base_url: company.base_url,
            route_id: routeId,
            created_at: new Date(),
            updated_at: new Date(),
            expires_at: new Date(Date.now() + 30 * 60 * 1000)
        });

        return { sessionId, routeId, company };
    }

    async login(req, email, password, isSwitch = false) {

        if(isSwitch){
            const requser = req.user;
            const user = await User.findOne({
                where: { email: requser.email },
                include: [
                    {
                    model: Role,
                    through: { attributes: [] },
                    include: [
                        {
                            model: Permission,
                            through: { attributes: [] }
                        },
                        {
                            model: UserMenu,
                            include: [
                                {
                                    model: Form,
                                    include: [
                                        {
                                            model: FormTab,
                                            include: [{
                                                model: SubForm,
                                                include: [FormField]
                                            }],
                                        } 
                                    ]
                                }
                            ],
                            attributes: { exclude: ['status', 'createdAt', 'updatedAt'] },
                            through: {
                                attributes: [
                                'can_list_view',
                                'can_create',
                                'can_edit',
                                'can_view',
                                'can_delete'
                                ]
                            },
                        }
                    ]
                    },
                    {
                    model: Branch,
                    through: { attributes: [] },
                    attributes: {exclude: ['createdAt', 'updatedAt']},
                    through: {
                        attributes: ['sap_emp_id']
                    },
                    include: [
                        {
                            model: Company,
                            attributes: {exclude: ['createdAt', 'updatedAt']},
                        }
                    ]
                }
                ]
            });
            if (!user) throw new Error('Invalid email or user not found!');
            const sapLogin = await this.sapLogin(req, user.id);

            if (!req.body.company_id) {
                throw new Error('company ID is not found');
            }
            const companyId = req.body?.company_id;
            const decodedCompanyId = decodeId(companyId);

            // const fst_branch_sap_id = user?.Branches?.[0]?.UserBranch?.sap_emp_id;
            const file_cur_comp = user.Branches.filter(branch => branch.companyId == decodedCompanyId);
            const db_emp_id = file_cur_comp[0].UserBranch.sap_emp_id;
            console.log('current db_emp_id', db_emp_id);

            const token = jwt.sign(
                { id: user.id, email: user.email, is_super_user: user.is_super_user, EmployeeId: db_emp_id ?? null },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            const data = user.toJSON();
            delete data.password;
            delete data.status;
            delete data.createdAt;
            delete data.updatedAt;

            data.id = encodeId(data.id);
            data.Roles.map((role) => {
                role.id = encodeId(role.id)
                role.companyId = encodeId(role.companyId)
                delete role.status;
                delete role.createdAt;
                delete role.updatedAt;

                role.Permissions.map((permission) => {
                    permission.id = encodeId(permission.id)
                    delete permission.createdAt;
                    delete permission.updatedAt;
                })

                role.UserMenus = usermenu(role.UserMenus);
                role.UserMenus.map(menuItem => encodeUserMenu(menuItem));
            })

            data.Branches.map((branch) => {
                branch.id = encodeId(branch.id)
                branch.companyId = encodeId(branch.companyId)
                branch.Company.id = encodeId(branch.Company.id)
                delete branch.Company.company_db_name;
                delete branch.Company.base_url;
                delete branch.Company.sap_username;
                delete branch.Company.secret_key;
            })
            

            return { token, user, data, sapLogin };
        }

        // regular llogin
        const user = await User.findOne({
            where: { email },
            include: [
                {
                model: Role,
                through: { attributes: [] },
                include: [
                    {
                        model: Permission,
                        through: { attributes: [] }
                    },
                    {
                        model: UserMenu,
                        include: [
                            {
                                model: Form,
                                include: [
                                    {
                                        model: FormTab,
                                        include: [{
                                            model: SubForm,
                                            include: [FormField]
                                        }],
                                    } 
                                ]
                            }
                        ],
                        attributes: { exclude: ['status', 'createdAt', 'updatedAt'] },
                        through: {
                            attributes: [
                            'can_list_view',
                            'can_create',
                            'can_edit',
                            'can_view',
                            'can_delete'
                            ]
                        },
                    }
                ]
                },
                {
                    model: Branch,
                    through: { attributes: [] },
                    through: {
                        attributes: ['sap_emp_id']
                    },
                    attributes: {exclude: ['createdAt', 'updatedAt']},
                    include: [
                        {
                            model: Company,
                            attributes: {exclude: ['createdAt', 'updatedAt']},
                        }
                    ]
                }
            ]
        });
        if (!user) throw new Error('Invalid email or user not found!');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error('Invalid password!');

        let sapLogin;
        if(user.is_super_user === 0){
            sapLogin = await this.sapLogin(req, user.id);
        }

        const fst_branch_sap_id = user?.Branches?.[0]?.UserBranch?.sap_emp_id;
        // console.log('fst_branch_sap_id', fst_branch_sap_id);

        const token = jwt.sign(
            { id: user.id, email: user.email, is_super_user: user.is_super_user, EmployeeId: fst_branch_sap_id ?? null },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const data = user.toJSON();
        delete data.password;
        delete data.status;
        delete data.createdAt;
        delete data.updatedAt;

        data.id = encodeId(data.id);
        data.Roles.map((role) => {
            role.id = encodeId(role.id)
            role.companyId = encodeId(role.companyId)
            delete role.status;
            delete role.createdAt;
            delete role.updatedAt;

            role.Permissions.map((permission) => {
                permission.id = encodeId(permission.id)
                delete permission.createdAt;
                delete permission.updatedAt;
            })

            role.UserMenus = usermenu(role.UserMenus);
            role.UserMenus.map(menuItem => encodeUserMenu(menuItem));
        })

        data.Branches.map((branch) => {
            branch.id = encodeId(branch.id)
            branch.companyId = encodeId(branch.companyId)
            branch.Company.id = encodeId(branch.Company.id)
            delete branch.Company.company_db_name;
            delete branch.Company.base_url;
            delete branch.Company.sap_username;
            delete branch.Company.secret_key;
        })
        

        return { token, user, data, sapLogin };
    }

    async profile(id){
        const user = await User.findByPk(id, {
            // include: [{ model: Role,
            //     include: [Permission]
            // }],
            attributes: { exclude: ['status', 'password', 'createdAt', 'updatedAt'] }
        });

        return user;
    }

    async forgotPassword(email) {
        const user = await User.findOne({ where: { email } });
        if (!user) throw new Error('Email not found');

        const resetToken = jwt.sign(
            { id: user.id },
            process.env.RESET_PASSWORD_SECRET,
            { expiresIn: '15m' }
        );

        const resetLink = `${process.env.RESET_PASSWORD_FRONTEND_URL}/reset-password?token=${resetToken}`;

        await sendEmail(email, "Reset password", `Click this link to reset your password: ${resetLink}`);
        return resetLink;
    }

    async resetPassword(token, newPassword) {
        try {
            const decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);
            const user = await User.findByPk(decoded.id);
            if (!user) throw new Error('Invalid user');

            user.password = newPassword;
            await user.save();
            await sendEmail(user.email, "Password reset successfull", "Password has been changed successfully!");
            return true;
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }

    async changePassword(userId, currentPassword, newPassword) {
        try {
            const user = await User.findByPk(userId);
            if (!user) throw new Error('User not found');

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) throw new Error('Current password is incorrect');

            user.password = newPassword;
            await user.save();
            return { message: "Password updated successfully" };
        } catch (error) {
            throw new Error(error.message || 'Failed to change password');
        }
    }
}

module.exports = AuthService;