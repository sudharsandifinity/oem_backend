const Joi = require('joi');

const createBranchSchema = Joi.object({
    companyId: Joi.required().messages({
        'any.required': 'Company ID is required'
    }),
    branch_code: Joi.required().messages({
        'any.required': 'Branch Code is required'
    }),
    name: Joi.string().required().messages({
        'string.empty': 'Branch name is required',
        'any.required': 'Branch name is required'
    }),
    city: Joi.string().required().messages({
        'string.empty': 'City is required',
        'any.required': 'City is required'
    }),
    address: Joi.string().required().messages({
        'string.empty': 'Address is required',
        'any.required': 'Address is required'
    }),
    status: Joi.number().valid(0, 1).optional().messages({
        'number.base': 'Status must be a number',
        'any.only': 'Status must be 0 (Inactive) or 1 (Active)'
    })
});

const updateBranchSchema = Joi.object({
    companyId: Joi.optional().messages({
        'number.empty': 'Compnay ID cannot be empty'
    }),
    branch_code: Joi.optional().messages({
        'any.required': 'Branch Code cannot be empty'
    }),
    name: Joi.string().optional().messages({
        'string.empty': 'Branch name cannot be empty'
    }),
    city: Joi.string().optional().messages({
        'string.empty': 'City cannot be empty'
    }),
    address: Joi.string().optional().messages({
        'string.empty': 'Address cannot be empty'
    }),
    status: Joi.number().valid(0, 1).optional().messages({
        'number.base': 'Status must be a number',
        'any.only': 'Status must be 0 or 1'
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
    createBranchSchema,
    updateBranchSchema,
    getByPkSchema,
    validate,
    validateParams
};