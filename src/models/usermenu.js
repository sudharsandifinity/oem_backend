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
    }
  }
  UserMenu.init({
    name: DataTypes.STRING,
    display_name: DataTypes.STRING,
    parent: DataTypes.INTEGER,
    order_number: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserMenu',
    tableName: 'user_menus'
  });
  return UserMenu;
};