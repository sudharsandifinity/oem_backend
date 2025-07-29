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
  parent: Joi.string().allow(null, '').optional(),
  order_number: Joi.number().integer().optional().messages({
    'number.base': 'Order number must be a number'
  })
});

const updateUserMenuSchema = Joi.object({
  name: Joi.string().optional().messages({
    'string.empty': 'Name cannot be empty'
  }),
  display_name: Joi.string().optional().messages({
    'string.empty': 'Display name cannot be empty'
  }),
  parent: Joi.string().allow(null, '').optional(),
  order_number: Joi.number().integer().optional().messages({
    'number.base': 'Order number must be a number'
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
  createUserMenuSchema,
  updateUserMenuSchema,
  getByPkSchema,
  validate,
  validateParams
};