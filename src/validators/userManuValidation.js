const Joi = require('joi');

const createUserMenuSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Name is required',
    'any.required': 'Name is required'
  }),
  display_name: Joi.string().required().messages({
    'string.empty': 'Display name is required',
    'any.required': 'Display name is required'
  }),
  companyId: Joi.string().allow(null, '').optional().messages({
    'string.base': 'Company ID must be a string'
  }),
  parentUserMenuId: Joi.string().allow(null, '').optional().messages({
    'string.base': 'Parent Form ID must be a string'
  }),
  formId: Joi.string().allow(null, '').optional().messages({
    'string.base': 'Parent Form ID must be a string'
  }),
  order_number: Joi.number().integer().optional().messages({
    'number.base': 'Order number must be a number'
  }),
  status: Joi.number().integer().valid(0, 1).optional().messages({
    'number.base': 'Status must be a number',
    'any.only': 'Status must be 0 (inactive) or 1 (active)'
  })
});

const updateUserMenuSchema = Joi.object({
  name: Joi.string().optional().messages({
    'string.empty': 'Name cannot be empty'
  }),
  display_name: Joi.string().optional().messages({
    'string.empty': 'Display name cannot be empty'
  }),
  companyId: Joi.string().allow(null, '').optional().messages({
    'string.base': 'Company ID must be a string'
  }),
  parentUserMenuId: Joi.string().allow(null, '').optional().messages({
    'string.base': 'Parent Form ID must be a string'
  }),
  formId: Joi.string().allow(null, '').optional().messages({
    'string.base': 'Parent Form ID must be a string'
  }),
  order_number: Joi.number().integer().optional().messages({
    'number.base': 'Order number must be a number'
  }),
  status: Joi.number().integer().valid(0, 1).optional().messages({
    'number.base': 'Status must be a number',
    'any.only': 'Status must be 0 (inactive) or 1 (active)'
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
  createUserMenuSchema,
  updateUserMenuSchema,
  getByPkSchema,
  validate,
  validateParams
};
