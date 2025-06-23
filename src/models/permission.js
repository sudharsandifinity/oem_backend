'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Permission.init({
    name: DataTypes.STRING,
    module: DataTypes.STRING,
    http_method: DataTypes.ENUM('GET', 'POST', 'PUT', 'DELETE', 'PATCH'),
    route: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Permission',
    tableName: 'permissions'
  });
  return Permission;
};