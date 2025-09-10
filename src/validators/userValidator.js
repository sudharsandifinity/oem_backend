const Joi = require('joi');

const createUserSchema = Joi.object({
    first_name: Joi.string().required().messages({
        'string.empty': 'First name is required',
        'any.required': 'First name is required'
    }),
    last_name: Joi.string().required().messages({
        'string.empty': 'Last name is required',
        'any.required': 'Last name is required'
    }),
    email: Joi.string().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters',
        'any.required': 'Password is required'
    }),
    is_super_user: Joi.number().max(1).optional().messages({
        'number.base': 'is_super_user must be a number',
        'number.max': 'is_super_user cannot be more than 1'
    }),
    roleIds: Joi.array().items(Joi.string()).optional().messages({
        'array.base': 'Role IDs must be an array of strings',
        'array.includes': 'Each role ID must be a string'
    }),
    branchIds: Joi.array().items(Joi.string()).optional().messages({
        'array.base': 'Branch IDs must be an array of strings',
        'array.includes': 'Each branch ID must be a string'
    }),
    status: Joi.number().max(1).optional().messages({
        'number.base': 'Status must be a number',
        'number.max': 'Status cannot be more than 1'
    })
});

const updateUserSchema = Joi.object({
    first_name: Joi.string().optional().messages({
        'string.empty': 'First name cannot be empty'
    }),
    last_name: Joi.string().optional().messages({
        'string.empty': 'Last name cannot be empty'
    }),
    email: Joi.string().email().optional().messages({
        'string.email': 'Email must be a valid email address'
    }),
    password: Joi.string().min(6).optional().messages({
        'string.min': 'Password must be at least 6 characters'
    }),
    is_super_user: Joi.number().max(1).optional().messages({
        'number.base': 'is_super_user must be a number',
        'number.max': 'is_super_user cannot be more than 1'
    }),
    roleIds: Joi.array().items(Joi.string()).optional().messages({
        'array.base': 'Role IDs must be an array of strings',
        'array.includes': 'Each role ID must be a string'
    }),
    branchIds: Joi.array().items(Joi.string()).optional().messages({
        'array.base': 'Branch IDs must be an array of strings',
        'array.includes': 'Each branch ID must be a string'
    }),
    status: Joi.number().max(1).optional().messages({
        'number.base': 'Status must be a number',
        'number.max': 'Status cannot be more than 1'
    })
});

const getByPkSchema = Joi.object({
    id: Joi.string().required().messages({
        'any.required': 'ID is required'
    })
});

function validate(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: true });
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        next();
    };
}

function validateParams(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.params, { abortEarly: true });
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        next();
    };
}

module.exports = {
    createUserSchema,
    updateUserSchema,
    getByPkSchema,
    validate,
    validateParams
};