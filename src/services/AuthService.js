const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SAPSession, User, Role, Permission, UserMenu, Branch, Company, Form, FormTab, SubForm, FormField } = require('../models');
const { sendEmail } = require('../config/mail');
const { encodeId, decodeId } = require("../utils/hashids");
const { usermenu, encodeUserMenu } = require('../utils/usermenu');
const axios = require('axios');
const https = require('https');

class AuthService {

    async sapLogin(userId) {
        const payload = {
            UserName: "manager",
            Password: "Sap@1234",
            CompanyDB: "GLD_Demo"
        };

        const response = await axios.post(
            'https://192.168.100.82:50000/b1s/v2/Login',
            payload,
                {
                    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 10000,
                }
        );

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
            user_id: userId,
            sap_username: 'manager',
            company_db: 'GLD_Demo',
            b1_session: sessionId,
            route_id: routeId,
            created_at: new Date(),
            updated_at: new Date(),
            expires_at: new Date(Date.now() + 30 * 60 * 1000)
        });

        return { sessionId, routeId };
    }

    async login(email, password) {
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

        const token = jwt.sign(
            { id: user.id, email: user.email, is_super_user: user.is_super_user },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // let externalLoginResponse = null;
        // let sapData;

        // if (user.is_super_user === 0) {
        //     try {
        //         const externalPayload = {
        //             UserName: "manager",
        //             Password: "Sap@1234",
        //             CompanyDB: "GLD_Demo"
        //         };

        //         const response = await axios.post(
        //             'https://192.168.100.82:50000/b1s/v2/Login',
        //             externalPayload,
        //             {
        //                 httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        //                 headers: {
        //                     'Content-Type': 'application/json'
        //                 },
        //                 // timeout: 5000
        //             }
        //         );

        //         externalLoginResponse = response;

        //         if (!externalLoginResponse || externalLoginResponse.error) {
        //             console.error('SAP error response:', externalLoginResponse);
        //             throw new Error('External system login failed.');
        //         }

        //         console.log('SAP Login Successful:', externalLoginResponse.data);
                
        //         sapData = {
        //             B1SESSION: externalLoginResponse.data.SessionId,
        //             ROUTEID: '.node1'
        //         }

        //     } catch (error) {
        //         console.error('External SAP login error:', error.message);
        //         throw new Error('Failed to authenticate with external system.');
        //     }
        // }

        if(user.is_super_user === 0){
            this.sapLogin(user.id);
        }

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
        })
        

        return { token, user, data };
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

}

module.exports = AuthService;