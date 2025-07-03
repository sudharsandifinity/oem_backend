const Joi = require('joi');

const createFormFieldSchema = Joi.object({
  formId: Joi.required().messages({
    'any.required': 'Form ID is required'
  }),
  formSectionId: Joi.required().messages({
    'any.required': 'Form Section ID is required'
  }),
  field_name: Joi.string().required().messages({
    'string.empty': 'Field name is required',
    'any.required': 'Field name is required'
  }),
  display_name: Joi.string().required().messages({
    'string.empty': 'Display name is required',
    'any.required': 'Display name is required'
  }),
  input_type: Joi.string().required().messages({
    'string.empty': 'Input type is required',
    'any.required': 'Input type is required'
  }),
  display_position: Joi.string().optional(),
  field_order: Joi.string().optional(),
  is_visible: Joi.number().max(1).optional().messages({
    'number.base': 'Is Visible must be a number',
    'number.max': 'Is Visible cannot be more than 1'
  }),
  is_field_data_bind: Joi.number().max(1).optional().messages({
    'number.base': 'Is Field Data Bind must be a number',
    'number.max': 'Is Field Data Bind cannot be more than 1'
  }),
  bind_data_by: Joi.optional(),
  status: Joi.number().max(1).optional().messages({
    'number.base': 'Status must be a number',
    'number.max': 'Status cannot be more than 1'
  })
});

const updateFormFieldSchema = Joi.object({
  formId: Joi.string().optional().messages({
    'string.empty': 'Form ID is required'
  }),
  formSectionId: Joi.optional().messages({
    'any.required': 'Form Section ID is required'
  }),
  field_name: Joi.string().optional().messages({
    'string.empty': 'Field name cannot be empty'
  }),
  display_name: Joi.string().optional().messages({
    'string.empty': 'Display name cannot be empty'
  }),
  input_type: Joi.string().optional().messages({
    'string.empty': 'Input type cannot be empty'
  }),
  display_position: Joi.string().optional(),
  field_order: Joi.string().optional(),
  is_visible: Joi.number().max(1).optional().messages({
    'number.base': 'Is Visible must be a number',
    'number.max': 'Is Visible cannot be more than 1'
  }),
  is_field_data_bind: Joi.number().max(1).optional().messages({
    'number.base': 'Is Field Data Bind must be a number',
    'number.max': 'Is Field Data Bind cannot be more than 1'
  }),
  bind_data_by: Joi.optional(),
  status: Joi.number().max(1).optional().messages({
    'number.base': 'Status must be a number',
    'number.max': 'Status cannot be more than 1'
  })
});

// ID Validator (for GET /:id, etc.)
const getByPkSchema = Joi.object({
  id: Joi.string().required().messages({
    'any.required': 'ID is required'
  })
});

// Middleware to validate request body
function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: true });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };
}

// Middleware to validate URL params
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
  createFormFieldSchema,
  updateFormFieldSchema,
  getByPkSchema,
  validate,
  validateParams
};
