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

const forgotPassword = Joi.object({
    email: Joi.string().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Email format is invalid'
    })
});

const resetPasswordSchema = Joi.object({
    newPassword: Joi.string().min(6).required(),
    confirmPassword: Joi.any().valid(Joi.ref('newPassword')).required().messages({
        'any.only': 'Confirm password does not match new password',
        'any.required': 'Confirm password is required'
    })
});

function validate(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
        next();
    };
}

module.exports = { loginSchema, changePasswordValidator, forgotPassword, resetPasswordSchema, validate };