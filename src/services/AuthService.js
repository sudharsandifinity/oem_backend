const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SAPSession, User, Role, Permission, UserMenu, UserBranch, Branch, Company, Form, FormTab, SubForm, FormField } = require('../models');
const { sendEmail } = require('../config/mail');
const { encodeId, decodeId } = require("../utils/hashids");
const { usermenu, encodeUserMenu } = require('../utils/usermenu');
const axios = require('axios');
const https = require('https');
const { decrypt } = require('../utils/crypto');
const crypto = require('crypto');

const RESET_OTP = {
    TTL_MS: 10 * 60 * 1000,
    MAX_ATTEMPTS: 5,
    RESEND_COOLDOWN_MS: 60 * 1000,
    WINDOW_MS: 60 * 60 * 1000,
    MAX_REQUESTS_PER_WINDOW: 5,
    RESET_TOKEN_TTL_MS: 10 * 60 * 1000
};

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
            const companyName = file_cur_comp[0]?.Company.name;
            // console.log('compayname', companyName);
            const db_emp_id = file_cur_comp[0].UserBranch.sap_emp_id;
            console.log('current db_emp_id', db_emp_id);

            const token = jwt.sign(
                { id: user.id, email: user.email, is_super_user: user.is_super_user, EmployeeId: db_emp_id ?? null, companyName: companyName },
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
        const companyName = user?.Branches?.[0]?.Company.name;
        // console.log('fst_branch_sap_id', fst_branch_sap_id);
        // console.log('companyName', companyName);

        const token = jwt.sign(
            { id: user.id, email: user.email, is_super_user: user.is_super_user, EmployeeId: fst_branch_sap_id ?? null, companyName: companyName },
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

    hashResetValue(value) {
        return crypto.createHmac('sha256', process.env.RESET_PASSWORD_SECRET).update(String(value)).digest('hex');
    }

    resetError(message, status = 400) {
        const error = new Error(message);
        error.status = status;
        return error;
    }

    clearResetOtp(user) {
        user.reset_otp_hash = null;
        user.reset_otp_expires_at = null;
        user.reset_otp_attempts = 0;
    }

    async forgotPassword(email) {
        const user = await User.findOne({ where: { email } });
        if (!user || Number(user.status) !== 1) return;

        const now = Date.now();
        const sentAt = user.reset_otp_sent_at ? new Date(user.reset_otp_sent_at).getTime() : 0;
        if (now - sentAt < RESET_OTP.RESEND_COOLDOWN_MS) return;

        const windowStart = user.reset_otp_window_start ? new Date(user.reset_otp_window_start).getTime() : 0;
        if (!windowStart || now - windowStart >= RESET_OTP.WINDOW_MS) {
            user.reset_otp_window_start = new Date(now);
            user.reset_otp_request_count = 0;
        }
        if (user.reset_otp_request_count >= RESET_OTP.MAX_REQUESTS_PER_WINDOW) return;

        const otp = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
        const previousSentAt = user.reset_otp_sent_at;

        user.reset_otp_hash = this.hashResetValue(`${user.id}:${otp}`);
        user.reset_otp_expires_at = new Date(now + RESET_OTP.TTL_MS);
        user.reset_otp_attempts = 0;
        user.reset_otp_sent_at = new Date(now);
        user.reset_otp_request_count = (user.reset_otp_request_count || 0) + 1;
        user.reset_session_id = null;
        await user.save();

        const minutes = Math.round(RESET_OTP.TTL_MS / 60000);
        try {
            await sendEmail(
                user.email,
                "Password reset verification code",
                `Your password reset verification code is ${otp}.\n\nThis code expires in ${minutes} minutes. If you did not request a password reset, you can ignore this email.`
            );
        } catch (error) {
            console.error('[FORGOT-PASSWORD] failed to send verification code', error.message);
            this.clearResetOtp(user);
            user.reset_otp_sent_at = previousSentAt;
            user.reset_otp_request_count = Math.max(0, user.reset_otp_request_count - 1);
            await user.save();
            throw this.resetError('Unable to send the verification code right now. Please try again later.', 503);
        }
    }

    async verifyResetOtp(email, otp) {
        const invalid = () => this.resetError('Invalid or expired verification code');

        const user = await User.findOne({ where: { email } });
        if (!user || Number(user.status) !== 1 || !user.reset_otp_hash || !user.reset_otp_expires_at) {
            throw invalid();
        }

        if (new Date(user.reset_otp_expires_at).getTime() < Date.now()) {
            this.clearResetOtp(user);
            await user.save();
            throw invalid();
        }

        const expected = Buffer.from(user.reset_otp_hash, 'hex');
        const actual = Buffer.from(this.hashResetValue(`${user.id}:${otp}`), 'hex');
        const matches = expected.length === actual.length && crypto.timingSafeEqual(expected, actual);

        if (!matches) {
            user.reset_otp_attempts = (user.reset_otp_attempts || 0) + 1;
            if (user.reset_otp_attempts >= RESET_OTP.MAX_ATTEMPTS) {
                this.clearResetOtp(user);
                await user.save();
                throw this.resetError('Too many incorrect attempts. Please request a new verification code.', 429);
            }
            await user.save();
            throw invalid();
        }

        const sessionId = crypto.randomBytes(32).toString('hex');
        this.clearResetOtp(user);
        user.reset_session_id = this.hashResetValue(sessionId);
        await user.save();

        const resetToken = jwt.sign(
            { id: user.id, sid: sessionId, purpose: 'password_reset' },
            process.env.RESET_PASSWORD_SECRET,
            { expiresIn: Math.round(RESET_OTP.RESET_TOKEN_TTL_MS / 1000) }
        );

        return { resetToken, expiresIn: Math.round(RESET_OTP.RESET_TOKEN_TTL_MS / 1000) };
    }

    async resetPassword(resetToken, newPassword) {
        const invalid = () => this.resetError('Reset session is invalid or has expired. Please request a new verification code.');

        let decoded;
        try {
            decoded = jwt.verify(resetToken, process.env.RESET_PASSWORD_SECRET);
        } catch (error) {
            throw invalid();
        }

        if (decoded?.purpose !== 'password_reset' || !decoded.sid || !decoded.id) throw invalid();

        const user = await User.findByPk(decoded.id);
        if (!user || Number(user.status) !== 1 || !user.reset_session_id) throw invalid();

        const expected = Buffer.from(user.reset_session_id, 'hex');
        const actual = Buffer.from(this.hashResetValue(decoded.sid), 'hex');
        if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) throw invalid();

        user.password = newPassword;
        user.reset_session_id = null;
        this.clearResetOtp(user);
        await user.save();

        try {
            await sendEmail(user.email, "Password changed", "Your password has been changed successfully. If you did not do this, contact your administrator immediately.");
        } catch (error) {
            console.error('[RESET-PASSWORD] failed to send confirmation email', error.message);
        }

        return true;
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