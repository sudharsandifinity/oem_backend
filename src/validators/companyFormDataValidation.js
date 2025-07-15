const Joi = require('joi');

const createCompanyFormDataSchema = Joi.object({
  companyFormId: Joi.number().integer().required().messages({
    'number.base': 'Company Form ID must be a number',
    'any.required': 'Company Form ID is required'
  }),
  form_data: Joi.string().allow(null, '').optional().messages({
    'string.base': 'Form data must be a string'
  })
});

const updateCompanyFormDataSchema = Joi.object({
  companyFormId: Joi.number().integer().optional().messages({
    'number.base': 'Company Form ID must be a number'
  }),
  form_data: Joi.string().allow(null, '').optional().messages({
    'string.base': 'Form data must be a string'
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
  createCompanyFormDataSchema,
  updateCompanyFormDataSchema,
  getByPkSchema,
  validate,
  validateParams
};
