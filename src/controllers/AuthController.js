const logger = require('../config/logger');
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
            const result = await authService.login(email, password);
            logger.info('Login in successfully!', {email: email});

            res.cookie('token', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                maxAge: parseInt(process.env.ACCESS_TOKEN_MAX_AGE)
            });

            // if(result.user.is_super_user == 0 && result.sapData){
            //     res.cookie('B1SESSION', result.sapData.B1SESSION, {
            //         httpOnly: true,
            //         maxAge: parseInt(process.env.ACCESS_TOKEN_MAX_AGE)
            //     });
    
            //     res.cookie('ROUTEID', result.sapData.ROUTEID, {
            //         httpOnly: true,
            //         domain: '192.168.100.82',
            //         path: '/b1s/v2', 
            //     });
            // }

            return res.status(200).json({
                message: 'Login successful',
                token: result.token,
                user: result.data
            });
        } catch (error) {
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

    logout = async (req, res) => {
        res.clearCookie('token');
        res.json({ message: 'Logged out successfully' });
    }


}

module.exports = new AuthController();