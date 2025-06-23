const Joi = require('joi');

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Email format is invalid'
    }),
    password: Joi.string().required().messages({
        'string.empty': 'Password is required'
    })
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

module.exports = { loginSchema, forgotPassword, resetPasswordSchema, validate };