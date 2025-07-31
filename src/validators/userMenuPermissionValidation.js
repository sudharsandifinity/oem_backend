const Joi = require('joi');

const createUserMenuPermissionSchema = Joi.object({
    userMenuId: Joi.string().required().messages({
        'string.empty': 'Company Form Field Id is required',
        'any.required': 'Company Form Field Id is required'
    }),
    can_list_view: Joi.number().valid(0, 1).optional().messages({
        'number.base': 'can_list_view must be a number',
        'any.only': 'can_list_view must be 0 or 1'
    }),
    can_create: Joi.number().valid(0, 1).optional().messages({
        'number.base': 'can_create must be a number',
        'any.only': 'can_create must be 0 or 1'
    }),
    can_edit: Joi.number().valid(0, 1).optional().messages({
        'number.base': 'can_edit must be a number',
        'any.only': 'can_edit must be 0 or 1'
    }),
    can_view: Joi.number().valid(0, 1).optional().messages({
        'number.base': 'can_view must be a number',
        'any.only': 'can_view must be 0 or 1'
    }),
    can_delete: Joi.number().valid(0, 1).optional().messages({
        'number.base': 'can_delete must be a number',
        'any.only': 'can_delete must be 0 or 1'
    })
});

const updateUserMenuPermissionSchema = Joi.object({
    userMenuId: Joi.string().optional().messages({
        'string.empty': 'Company Form Field Id is required',
        'any.required': 'Company Form Field Id is required'
    }),
    can_list_view: Joi.number().valid(0, 1).optional().messages({
        'number.base': 'can_list_view must be a number',
        'any.only': 'can_list_view must be 0 or 1'
    }),
    can_create: Joi.number().valid(0, 1).optional().messages({
        'number.base': 'can_create must be a number',
        'any.only': 'can_create must be 0 or 1'
    }),
    can_edit: Joi.number().valid(0, 1).optional().messages({
        'number.base': 'can_edit must be a number',
        'any.only': 'can_edit must be 0 or 1'
    }),
    can_view: Joi.number().valid(0, 1).optional().messages({
        'number.base': 'can_view must be a number',
        'any.only': 'can_view must be 0 or 1'
    }),
    can_delete: Joi.number().valid(0, 1).optional().messages({
        'number.base': 'can_delete must be a number',
        'any.only': 'can_delete must be 0 or 1'
    })
});

const getByPkSchema = Joi.object({
    id: Joi.string().required().messages({
        'any.required': 'ID is required',
        'string.empty': 'ID cannot be empty'
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
    createUserMenuPermissionSchema,
    updateUserMenuPermissionSchema,
    getByPkSchema,
    validate,
    validateParams
};
