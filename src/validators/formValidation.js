const Joi = require('joi');

const createFormSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Form name is required',
        'any.required': 'Form name is required'
    }),
    display_name: Joi.string().required().messages({
        'string.empty': 'Form display name is required',
        'any.required': 'Form display name is required'
    }),
    status: Joi.number().valid(0, 1).optional().messages({
        'number.base': 'Status must be a number',
        'any.only': 'Status must be 0 (Inactive) or 1 (Active)'
    })
});

const updateFormSchema = Joi.object({
    name: Joi.string().optional().messages({
        'string.empty': 'Form name cannot be empty'
    }),
    display_name: Joi.string().optional().messages({
        'string.empty': 'Form display name is required',
        'any.required': 'Form display name is required'
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
    createFormSchema,
    updateFormSchema,
    getByPkSchema,
    validate,
    validateParams
};