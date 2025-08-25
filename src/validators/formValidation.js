const Joi = require('joi');

const createFormSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Form name is required',
        'any.required': 'Form name is required'
    }),
    scope: Joi.string()
        .valid('global', 'company', 'branch')
        .required()
        .messages({
            'any.only': 'Scope must be one of global, company, or branch',
            'any.required': 'Scope is required'
    }),
    display_name: Joi.string().required().messages({
        'string.empty': 'Form display name is required',
        'any.required': 'Form display name is required'
    }),
    form_type: Joi.string().required().messages({
        'string.empty': 'Form type is required',
        'any.required': 'Form type is required'
    }),
    status: Joi.number().valid(0, 1).optional().messages({
        'number.base': 'Status must be a number',
        'any.only': 'Status must be 0 (Inactive) or 1 (Active)'
    }),
    companyId: Joi.string().allow(null, '').optional().messages({
        'string.base': 'Company ID must be a string'
    }),
    branchId: Joi.string().allow(null, '').optional().messages({
        'string.base': 'Branch ID must be a string'
    }),
    parentFormId: Joi.string().allow(null, '').optional().messages({
        'string.base': 'Parent Form ID must be a string'
    }),
    status: Joi.number().max(1).optional().messages({
        'number.base': 'Status must be a number',
        'number.max': 'Status cannot be more than 1'
    })
});

const updateFormSchema = Joi.object({
    name: Joi.string().optional().messages({
        'string.empty': 'Form name cannot be empty'
    }),
    scope: Joi.string()
        .valid('global', 'company', 'branch')
        .optional()
        .messages({
            'any.only': 'Scope must be one of global, company, or branch'
    }),
    display_name: Joi.string().optional().messages({
        'string.empty': 'Form display name is required'
    }),
    form_type: Joi.string().optional().messages({
        'string.empty': 'Form type is required'
    }),
    status: Joi.number().valid(0, 1).optional().messages({
        'number.base': 'Status must be a number',
        'any.only': 'Status must be 0 or 1'
    }),
    companyId: Joi.string().allow(null, '').optional().messages({
        'string.base': 'Company ID must be a string'
    }),
    branchId: Joi.string().allow(null, '').optional().messages({
        'string.base': 'Branch ID must be a string'
    }),
    parentFormId: Joi.string().allow(null, '').optional().messages({
        'string.base': 'Parent Form ID must be a string'
    }),
    status: Joi.number().max(1).optional().messages({
        'number.base': 'Status must be a number',
        'number.max': 'Status cannot be more than 1'
    })
});

const getByPkSchema = Joi.object({
    id: Joi.string().required().messages({
        'any.required': 'ID is required',
        'string.base': 'ID must be a string'
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
    createFormSchema,
    updateFormSchema,
    getByPkSchema,
    validate,
    validateParams
};
