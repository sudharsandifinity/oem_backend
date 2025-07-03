const Joi = require('joi');

const createFormSectionSchema = Joi.object({
    section_name: Joi.string().required().messages({
        'string.empty': 'Form Section name is required',
        'any.required': 'Form Section name is required'
    }),
    status: Joi.number().valid(0, 1).optional().messages({
        'number.base': 'Status must be a number',
        'any.only': 'Status must be 0 (Inactive) or 1 (Active)'
    })
});

const updateFormSectionSchema = Joi.object({
    section_name: Joi.string().optional().messages({
        'string.empty': 'Form Section name cannot be empty' 
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
    createFormSectionSchema,
    updateFormSectionSchema,
    getByPkSchema,
    validate,
    validateParams
};