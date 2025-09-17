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
      Company.hasMany(models.Branch, {foreignKey: 'companyId'});
    }
  }
  Company.init({
    name: DataTypes.STRING,
    company_code: DataTypes.STRING,
    company_db_name: DataTypes.STRING,
    base_url: DataTypes.TEXT,
    sap_username: DataTypes.STRING,
    secret_key: DataTypes.TEXT,
    status: DataTypes.TINYINT
  }, {
    sequelize,
    modelName: 'Company',
    tableName: 'companies'
  });
  return Company;
};