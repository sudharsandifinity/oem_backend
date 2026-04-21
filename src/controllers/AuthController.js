const { logger } = require('../config/logger');
const AuthService = require('../services/AuthService');
const { encodeId } = require('../utils/hashids');
const { syncEmployees } = require('./ESSController');
const authService = new AuthService();

class AuthController {

    constructor(){
        this.authService = new AuthService();
        this.profile = this.profile.bind(this);
    }

    login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const result = await authService.login(req, email, password);
            logger.info('Login in successfully!', {email: email});

            const fst_branch = result?.sapLogin?.company?.Branches?.[0];
            const fil_bnc_rls = result.data?.Roles.filter(role => role?.branchId == fst_branch?.id);
            const comb_menu_par = fil_bnc_rls.flatMap(item => item.UserMenus ?? []);
            const comb_menu_chl = comb_menu_par.flatMap(menu =>  menu.children ?? [] );

            const userMenus = comb_menu_chl.map((menu) => {
                return menu = {
                    id: menu.id,
                    name: menu.name,
                    display_name: menu.display_name,
                    order_number: menu.order_number
                }
            });

            res.cookie('token', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                maxAge: parseInt(process.env.ACCESS_TOKEN_MAX_AGE)
            });

            return res.status(200).json({
                message: 'Login successful',
                token: result.token,
                user: result.data,
                sap: result?.sapLogin?.sessionId ?  "SAP Login was Successfull!":result.sapLogin,
                displayMenus: userMenus
            });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    sapLogin = async (req, res) => {
        try {
            const isSwitch = true;
            const result = await authService.login(req, null, null, isSwitch);
            logger.info('Company Switch successfully!', {companyId: req.body?.company_id});
            
            const fst_branch = result?.sapLogin?.company?.Branches?.[0];
            const fil_bnc_rls = result.data?.Roles.filter(role => role?.branchId == fst_branch?.id);
            // return res.send(fil_bnc_rls);
            const comb_menu_par = fil_bnc_rls.flatMap(item => item.UserMenus ?? []);
            const comb_menu_chl = comb_menu_par.flatMap(menu =>  menu.children ?? [] );

            const userMenus = comb_menu_chl.map((menu) => {
                return menu = {
                    id: menu.id,
                    name: menu.name,
                    display_name: menu.display_name,
                    order_number: menu.order_number
                }
            });

            res.cookie('token', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                maxAge: parseInt(process.env.ACCESS_TOKEN_MAX_AGE)
            });

            return res.status(200).json({
                token: result.token,
                message: 'SAP Login successful',
                displayMenus: userMenus
            });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    sapEmpSync = async (req, res) => {
        try{
            const saploginData = await this.authService.sapLogin(req, req.user.id);
            if(!saploginData?.sessionId){
                throw new Error ("sap login issue!")
            }
            const syncemp = await syncEmployees(req, res)
            return syncemp
        }catch(error){
            return res.status(400).json({ message: error.message });
        }
    }

    profile = async (req, res) => {
        const user = await this.authService.profile(req.user.id);
        return res.status(200).json(user);
    }

    forgotPassword = async (req, res) => {
        try {
            const { email } = req.body;
            const resetLink = await authService.forgotPassword(email);
            return res.status(200).json({ message: 'Reset link sent to email', resetLink });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    resetPassword = async (req, res) => {
        try {
            const { newPassword } = req.body;
            const { token } = req.query;
            
            if (!token) {
                return res.status(400).json({ message: 'Reset token is missing in URL query.' });
            }

            if (!newPassword) {
                return res.status(400).json({ message: 'New password is required.' });
            }

            await authService.resetPassword(token, newPassword);

            return res.status(200).json({ message: 'Password reset successful' });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    };

    changePassword = async (req, res) => {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        try{
            if (!newPassword) {
                return res.status(400).json({ message: 'New password is required.' });
            }
            await authService.changePassword(userId, currentPassword, newPassword);
            return res.status(200).json({ message: 'Password changed successful' });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
        
    }

    logout = async (req, res) => {
        res.clearCookie('token');
        res.json({ message: 'Logged out successfully' });
    }


}

module.exports = new AuthController();