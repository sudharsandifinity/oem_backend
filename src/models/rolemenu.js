'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoleMenu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RoleMenu.belongsTo(models.Role, { foreignKey: 'roleId' });
      RoleMenu.belongsTo(models.UserMenu, { foreignKey: 'userMenuId' });
    }
  }
  RoleMenu.init({
    roleId: DataTypes.INTEGER,
    userMenuId: DataTypes.INTEGER,
    can_list_view: DataTypes.BOOLEAN,
    can_create: DataTypes.BOOLEAN,
    can_edit: DataTypes.BOOLEAN,
    can_view: DataTypes.BOOLEAN,
    can_delete: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'RoleMenu',
    tableName: 'role_menus'
  });
  return RoleMenu;
};