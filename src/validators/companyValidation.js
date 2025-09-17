const Joi = require('joi');

const createCompanySchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Company name is required',
        'any.required': 'Company name is required'
    }),
    company_code: Joi.string().required().messages({
        'string.empty': 'Company Company Code is required',
        'any.required': 'Company Company Code is required'
    }),
    company_db_name: Joi.string().required().messages({
        'string.empty': 'Company Company DB Name is required',
        'any.required': 'Company Company DB Name is required'
    }),
    base_url: Joi.string().optional().messages({
        'string.empty': 'base URL is not empty'
    }),
    sap_username: Joi.string().optional().messages({
        'string.empty': 'sap username is not empty'
    }),
    secret_key: Joi.string().optional().messages({
        'string.empty': 'secret key is not empty'
    }),
    status: Joi.number().max(1).optional().messages({
        'number.base': 'Status must be a number',
        'number.max': 'Status cannot be more than 1'
    })
});

const updateCompanySchema = Joi.object({
    name: Joi.string().optional().messages({
        'string.empty': 'Company name cannot be empty'
    }),
    company_code: Joi.string().optional().messages({
        'string.empty': 'Company Company Code cannot be empty',
        'any.required': 'Company Company Code cannot be empty'
    }),
    company_db_name: Joi.string().optional().messages({
        'string.empty': 'Company Company DB Name cannot be empty',
        'any.required': 'Company Company DB Name cannot be empty'
    }),
     base_url: Joi.string().optional().messages({
        'string.empty': 'base URL is not empty'
    }),
    sap_username: Joi.string().optional().messages({
        'string.empty': 'sap username is not empty'
    }),
    secret_key: Joi.string().optional().messages({
        'string.empty': 'secret key is not empty'
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
    createCompanySchema,
    updateCompanySchema,
    getByPkSchema,
    validate,
    validateParams
};