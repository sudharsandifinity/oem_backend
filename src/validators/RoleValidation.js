const Joi = require('joi');

const menuGrant = Joi.object({
  menuId: Joi.string().required(),
  can_list_view: Joi.boolean().optional(),
  can_create: Joi.boolean().optional(),
  can_edit: Joi.boolean().optional(),
  can_view: Joi.boolean().optional(),
  can_delete: Joi.boolean().optional()
});

const nameField = Joi.string().messages({ 'string.empty': 'Name is required' });
const companyIdField = Joi.string().messages({ 'string.base': 'Company ID must be a string' });
const statusField = Joi.number().integer().valid(0, 1).optional().messages({
  'number.base': 'Status must be a number',
  'any.only': 'Status must be 0 or 1'
});
const userMenuIdsField = Joi.array().items(menuGrant).optional().messages({
  'array.base': 'User menus must be an array of objects'
});

const createRoleSchema = Joi.object({
  name: nameField.required().messages({ 'any.required': 'Name is required' }),

  scope: Joi.string().valid('master', 'user').default('user').messages({
    'any.only': 'Scope must be either "master" or "user"'
  }),

  companyId: companyIdField.required().messages({ 'any.required': 'Company ID is required' }),

  status: statusField,

  permissionIds: Joi.array()
    .items(Joi.string().required())
    .when('scope', {
      is: 'master',
      then: Joi.array().min(1).required(),
      otherwise: Joi.optional()
    })
    .messages({
      'array.base': 'Permission IDs must be an array',
      'any.required': 'Permission IDs are required for master roles',
      'array.min': 'At least one permission is required'
    }),

  userMenuIds: userMenuIdsField
});

const updateRoleSchema = Joi.object({
  name: nameField.optional().messages({ 'string.empty': 'Name cannot be empty' }),
  scope: Joi.string().valid('master', 'user').optional().messages({
    'any.only': 'Scope must be either "master" or "user"'
  }),
  companyId: companyIdField.optional(),
  status: statusField,
  permissionIds: Joi.array().items(Joi.string().required()).min(1).optional().messages({
    'array.base': 'Permission IDs must be an array',
    'array.min': 'At least one permission is required'
  }),
  userMenuIds: userMenuIdsField
});

const caCreateRoleSchema = Joi.object({
  name: nameField.required().messages({ 'any.required': 'Name is required' }),

  scope: Joi.string().valid('user').default('user').messages({
    'any.only': 'Company admins can only create user roles'
  }),

  companyId: companyIdField.required().messages({ 'any.required': 'Company ID is required' }),

  status: statusField,

  permissionIds: Joi.forbidden().messages({
    'any.unknown': 'Permissions cannot be assigned to company roles'
  }),

  userMenuIds: userMenuIdsField
});

const caUpdateRoleSchema = Joi.object({
  name: nameField.optional().messages({ 'string.empty': 'Name cannot be empty' }),
  scope: Joi.string().valid('user').optional().messages({
    'any.only': 'Company admins can only manage user roles'
  }),
  companyId: companyIdField.optional(),
  status: statusField,
  permissionIds: Joi.forbidden().messages({
    'any.unknown': 'Permissions cannot be assigned to company roles'
  }),
  userMenuIds: userMenuIdsField
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
  caCreateRoleSchema,
  caUpdateRoleSchema,
  getByPkSchema,
  validate,
  validateParams
};
