const Joi = require('joi');

const createRoleSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Name is required',
    'any.required': 'Name is required'
  }),

  scope: Joi.string().valid('master', 'user').required().messages({
    'any.only': 'Scope must be either "master" or "user"',
    'string.empty': 'Scope is required',
    'any.required': 'Scope is required'
  }),

  companyId: Joi.string().allow('').optional().messages({
    'string.base': 'Company ID must be a string'
}),


  status: Joi.number().max(1).optional().messages({
    'number.base': 'Status must be a number',
    'number.max': 'Status cannot be more than 1'
  }),

  permissionIds: Joi.when('scope', {
    is: 'master',
    then: Joi.array().items(Joi.string().trim().required()).min(1).required().messages({
      'array.base': 'Permission IDs must be an array of strings',
      'any.required': 'Permission IDs are required for master scope',
      'array.min': 'At least one permission ID must be provided',
      'string.base': 'Each permission ID must be a string'
    }),
    otherwise: Joi.forbidden()
  }),

  userMenuIds: Joi.when('scope', {
    is: 'user',
    then: Joi.array().items(Joi.string().trim().required()).min(1).required().messages({
      'array.base': 'User menu IDs must be an array of strings',
      'any.required': 'User menu IDs are required for user scope',
      'array.min': 'At least one user menu ID must be provided',
      'string.base': 'Each user menu ID must be a string'
    }),
    otherwise: Joi.forbidden()
  })
});

const updateRoleSchema = Joi.object({
  name: Joi.string().optional().messages({
    'string.empty': 'Name cannot be empty'
  }),

  scope: Joi.string().valid('master', 'user').optional().messages({
    'any.only': 'Scope must be either "master" or "user"'
  }),

    companyId: Joi.string().allow('').optional().messages({
        'string.base': 'Company ID must be a string'
    }),


  status: Joi.number().max(1).optional().messages({
    'number.base': 'Status must be a number',
    'number.max': 'Status cannot be more than 1'
  }),

  permissionIds: Joi.when('scope', {
    is: 'master',
    then: Joi.array().items(Joi.string().trim().required()).min(1).required().messages({
      'array.base': 'Permission IDs must be an array of strings',
      'any.required': 'Permission IDs are required when scope is "master"',
      'array.min': 'At least one permission ID must be provided'
    }),
    otherwise: Joi.forbidden()
  }),

  userMenuIds: Joi.when('scope', {
    is: 'user',
    then: Joi.array().items(Joi.string().trim().required()).min(1).required().messages({
      'array.base': 'User menu IDs must be an array of strings',
      'any.required': 'User menu IDs are required when scope is "user"',
      'array.min': 'At least one user menu ID must be provided'
    }),
    otherwise: Joi.forbidden()
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
  createRoleSchema,
  updateRoleSchema,
  getByPkSchema,
  validate,
  validateParams
};
