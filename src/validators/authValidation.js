const Joi = require('joi');

const loginSchema = Joi.object({
    // company_id: Joi.required().messages({
    //     'any.required': 'Company ID is required'
    // }),
    email: Joi.string().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Email format is invalid'
    }),
    password: Joi.string().required().messages({
        'string.empty': 'Password is required'
    })
});

const changePasswordValidator = Joi.object({
    currentPassword: Joi.string()
        .required()
        .messages({
            'string.empty': 'Current password is required',
            'any.required': 'Current password is required',
        }),

    newPassword: Joi.string()
        .min(8)
        .required()
        .messages({
            'string.empty': 'New password is required',
            'string.min': 'New password must be at least 8 characters long',
            'any.required': 'New password is required',
        }),

    confirmPassword: Joi.string()
        .valid(Joi.ref('newPassword'))
        .required()
        .messages({
            'any.only': 'Confirm password must match new password',
            'string.empty': 'Confirm password is required',
            'any.required': 'Confirm password is required',
        }),
});

const emailField = Joi.string().trim().lowercase().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email format is invalid',
    'any.required': 'Email is required'
});

const forgotPassword = Joi.object({
    email: emailField
});

const verifyResetOtpSchema = Joi.object({
    email: emailField,
    otp: Joi.string().trim().pattern(/^\d{6}$/).required().messages({
        'string.empty': 'Verification code is required',
        'string.pattern.base': 'Verification code must be 6 digits',
        'any.required': 'Verification code is required'
    })
});

const resetPasswordSchema = Joi.object({
    resetToken: Joi.string().required().messages({
        'string.empty': 'Reset token is required',
        'any.required': 'Reset token is required'
    }),
    newPassword: Joi.string().min(8).required().messages({
        'string.empty': 'New password is required',
        'string.min': 'New password must be at least 8 characters long',
        'any.required': 'New password is required'
    }),
    confirmPassword: Joi.any().valid(Joi.ref('newPassword')).required().messages({
        'any.only': 'Confirm password does not match new password',
        'any.required': 'Confirm password is required'
    })
});

function validate(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
        req.body = value;
        next();
    };
}

module.exports = { loginSchema, changePasswordValidator, forgotPassword, verifyResetOtpSchema, resetPasswordSchema, validate };