const Joi = require('joi');

const createCompanyFormDataSchema = Joi.object({
    companyFormId: Joi.string().required().messages({
        'string.empty': 'Form Id is required',
        'any.required': 'Form ID is required'
    }),
    form_data: Joi.alternatives(
        Joi.string(),
        Joi.object()
        ).optional().messages({
        'string.base': 'Form data must be a string or an object'
    })
});

const updateCompanyFormDataSchema = Joi.object({
    companyFormId: Joi.string().required().messages({
        'string.empty': 'Company Id is required',
        'any.required': 'Company ID is required'
    }),
    form_data: Joi.alternatives(
        Joi.string(),
        Joi.object()
        ).optional().messages({
        'string.base': 'Form data must be a string or an object'
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
