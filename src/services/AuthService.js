const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Role, Permission } = require('../models');
const { sendEmail } = require('../config/mail');
const { encodeId, decodeId } = require("../utils/hashids");

class AuthService {
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