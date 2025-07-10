const Joi = require('joi');

const createUserCompanyFormSchema = Joi.object({
    companyFormFieldId: Joi.string().required().messages({
        'string.empty': 'Company Form Field Id is required',
        'any.required': 'Company Form Field Id is required'
    }),
    userId: Joi.string().required().messages({
        'string.empty': 'user ID is required',
        'any.required': 'user ID is required'
    }),
    is_visible: Joi.number().optional(),
    status: Joi.number().valid(0, 1).optional().messages({
        'number.base': 'Status must be a number',
        'any.only': 'Status must be 0 (Inactive) or 1 (Active)'
    })
});

const updateUserCompanyFormSchema = Joi.object({
    companyFormFieldId: Joi.string().optional().messages({
        'string.empty': 'Company Form Field Id is required',
        'any.required': 'FCompany Form Field Id is required'
    }),
    userId: Joi.string().optional().messages({
        'string.empty': 'user ID is required',
        'any.required': 'user ID is required'
    }),
    is_visible: Joi.number().optional().messages({
        'number.base': 'is visible is required',
        'any.only': 'is visible is required'
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
    createUserCompanyFormSchema,
    updateUserCompanyFormSchema,
    getByPkSchema,
    validate,
    validateParams
};