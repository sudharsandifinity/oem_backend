'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
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
    scope: DataTypes.ENUM('master', 'user'),
    branchId: DataTypes.INTEGER,
    status: DataTypes.TINYINT
  }, {
    sequelize,
    modelName: 'Role',
  });
  return Role;
};