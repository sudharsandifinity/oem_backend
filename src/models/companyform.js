'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CompanyForm extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CompanyForm.belongsTo(models.Company, {foreignKey: "companyId"}),
      CompanyForm.belongsTo(models.Form, {foreignKey: "formId"})
    }
  }
  CompanyForm.init({
    companyId: DataTypes.INTEGER,
    formId: DataTypes.INTEGER,
    form_type: DataTypes.STRING,
    status: DataTypes.TINYINT
  }, {
    sequelize,
    modelName: 'CompanyForm',
    tableName: 'company_forms'
  });
  return CompanyForm;
};