const Joi = require('joi');

const createFormTabSchema = Joi.object({
  formId: Joi.string().required().messages({
    'string.empty': 'Form Id is required',
    'any.required': 'Form ID is required'
  }),
  name: Joi.string().required().messages({
    'string.empty': 'name is required',
    'any.required': 'name is required'
  }),
  display_name: Joi.string().required().messages({
    'string.empty': 'Display name is required',
    'any.required': 'Display name is required'
  }),
  status: Joi.number().max(1).optional().messages({
    'number.base': 'Status must be a number',
    'number.max': 'Status cannot be more than 1'
  })
});

const updateFormTabSchema = Joi.object({
  formId: Joi.string().optional().messages({
    'string.empty': 'Form Id cannot be empty',
    'any.required': 'Form ID is required'
  }),
  name: Joi.string().optional().messages({
    'string.empty': 'name cannot be empty'
  }),
  display_name: Joi.string().optional().messages({
    'string.empty': 'Display name cannot be empty'
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
  createFormTabSchema,
  updateFormTabSchema,
  getByPkSchema,
  validate,
  validateParams
};
