'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserMenu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserMenu.belongsTo(models.Form, {foreignKey: 'formId'});
    }
  }
  UserMenu.init({
    parentUserMenuId: DataTypes.INTEGER,
    companyId: DataTypes.INTEGER,
    branchId: DataTypes.INTEGER,
    formId: DataTypes.INTEGER,
    scope: DataTypes.ENUM('global', 'company', 'branch'),
    name: DataTypes.STRING,
    display_name: DataTypes.STRING,
    order_number: DataTypes.INTEGER,
    status: DataTypes.TINYINT
  }, {
    sequelize,
    modelName: 'UserMenu',
    tableName: 'user_menus'
  });
  return UserMenu;
};