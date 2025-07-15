'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CompanyFormData extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CompanyFormData.belongsTo(models.CompanyForm, {foreignKey: 'companyFormId'})
    }
  }CompanyFormData.init({
    companyFormId: DataTypes.INTEGER,
    form_data: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'CompanyFormData',
    tableName: 'company_form_datas'
  });
  return CompanyFormData;
};