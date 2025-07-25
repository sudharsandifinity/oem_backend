const Joi = require('joi');

const createRoleSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Name is required',
        'any.required': 'Name is required'
    }),
    status: Joi.number().max(1).optional().messages({
        'number.base': 'Status must be a number',
        'number.max': 'Status cannot be more than 1'
    }),
    permissionIds: Joi.array().items(Joi.string()).optional().messages({
        'array.base': 'Permission IDs must be an array of strings',
        'array.includes': 'Each permission ID must be a string'
    })
});

const updateRoleSchema = Joi.object({
    name: Joi.string().optional().messages({
        'string.empty': 'Name cannot be empty'
    }),
    status: Joi.number().max(1).optional().messages({
        'number.base': 'Status must be a number',
        'number.max': 'Status cannot be more than 1'
    }),
    permissionIds: Joi.array().items(Joi.string()).optional().messages({
        'array.base': 'Permission IDs must be an array of strings',
        'array.includes': 'Each permission ID must be a string'
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
    createRoleSchema,
    updateRoleSchema,
    getByPkSchema,
    validate,
    validateParams
};