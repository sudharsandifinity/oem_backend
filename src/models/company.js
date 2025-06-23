'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Company.hasMany(models.Branch);
    }
  }
  Company.init({
    name: DataTypes.STRING,
    city: DataTypes.STRING,
    address: DataTypes.TEXT,
    status: DataTypes.TINYINT
  }, {
    sequelize,
    modelName: 'Company',
    tableName: 'companies'
  });
  return Company;
};