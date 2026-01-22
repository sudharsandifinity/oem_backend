const { logger } = require('../config/logger');
const AuthService = require('../services/AuthService');
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

            res.cookie('token', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                maxAge: parseInt(process.env.ACCESS_TOKEN_MAX_AGE)
            });

            return res.status(200).json({
                message: 'Login successful',
                token: result.token,
                user: result.data
            });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    sapLogin = async (req, res) => {
        try{
            const login = await authService.sapLogin(req, res, null, req.user);
            res.status(200).json({response: login});
        } catch(error){
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
        const userId = req.user;
        const { currentPassword, newPassword } = req.body;

        try{
            if (!newPassword) {
                return res.status(400).json({ message: 'New password is required.' });
            }
            await authService.changePassword(userId, currentPassword, newPassword);
            return res.status(200).json({ message: 'Password reset successful' });
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