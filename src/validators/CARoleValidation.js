const {
  caCreateRoleSchema,
  caUpdateRoleSchema,
  getByPkSchema,
  validate,
  validateParams
} = require('./RoleValidation');

module.exports = {
  createRoleSchema: caCreateRoleSchema,
  updateRoleSchema: caUpdateRoleSchema,
  getByPkSchema,
  validate,
  validateParams
};
