'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.belongsToMany(models.Permission, {
        through: models.RolePermission,
        foreignKey: 'roleId',
        otherKey: 'permissionId'
      });

      Role.belongsToMany(models.UserMenu, {
        through: models.RoleMenu,
        foreignKey: 'roleId',
        otherKey: 'userMenuId'
      })

    }
  }
  Role.init({
    name: DataTypes.STRING,
    scope: {
      type: DataTypes.ENUM('master', 'user'),
      defaultValue: 'user'
    },
    companyId: DataTypes.INTEGER,
    status: DataTypes.TINYINT
  }, {
    sequelize,
    modelName: 'Role',
  });
  return Role;
};