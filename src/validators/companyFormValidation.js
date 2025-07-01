const Joi = require('joi');

const createCompanyFormSchema = Joi.object({
    companyId: Joi.string().required().messages({
        'string.empty': 'Company ID is required',
        'any.required': 'Form type is required'
    }),
    formId: Joi.string().required().messages({
        'string.empty': 'Form Id is required',
        'any.required': 'Form type is required'
    }),
    form_type: Joi.string().required().messages({
        'string.empty': 'Form type is required',
        'any.required': 'Form type is required'
    }),
    status: Joi.number().valid(0, 1).optional().messages({
        'number.base': 'Status must be a number',
        'any.only': 'Status must be 0 (Inactive) or 1 (Active)'
    })
});

const updateCompanyFormSchema = Joi.object({
    companyId: Joi.string().optional().messages({
        'string.empty': 'Company ID is required',
        'any.required': 'Form type is required'
    }),
    formId: Joi.string().optional().messages({
        'string.empty': 'Form Id is required',
        'any.required': 'Form type is required'
    }),
    form_type: Joi.string().optional().messages({
        'string.empty': 'Form type is required',
        'any.required': 'Form type is required'
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
    createCompanyFormSchema,
    updateCompanyFormSchema,
    getByPkSchema,
    validate,
    validateParams
};