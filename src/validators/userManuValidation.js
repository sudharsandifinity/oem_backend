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
  scope: Joi.string().valid('global', 'company', 'branch').default('global').messages({
    'any.only': 'Scope must be one of global, company, or branch'
  }),
  companyId: Joi.string().allow(null, '').optional().messages({
    'string.base': 'Company ID must be a string'
  }),
  branchId: Joi.string().allow(null, '').optional().messages({
    'string.base': 'Branch ID must be a string'
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
  status: Joi.number().max(1).optional().messages({
    'number.base': 'Status must be a number',
    'number.max': 'Status cannot be more than 1'
  })
});

const updateUserMenuSchema = Joi.object({
  name: Joi.string().optional().messages({
    'string.empty': 'Name cannot be empty'
  }),
  display_name: Joi.string().optional().messages({
    'string.empty': 'Display name cannot be empty'
  }),
  scope: Joi.string().valid('global', 'company', 'branch').optional().messages({
    'any.only': 'Scope must be one of global, company, or branch'
  }),
  companyId: Joi.string().allow(null, '').optional().messages({
    'string.base': 'Company ID must be a string'
  }),
  branchId: Joi.string().allow(null, '').optional().messages({
    'string.base': 'Branch ID must be a string'
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
  createUserMenuSchema,
  updateUserMenuSchema,
  getByPkSchema,
  validate,
  validateParams
};
