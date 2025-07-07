'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CompanyFormField extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CompanyFormField.belongsTo(models.Company);
      CompanyFormField.belongsTo(models.Form);
      CompanyFormField.belongsTo(models.FormSection);
    }
  }
  CompanyFormField.init({
    companyId: DataTypes.INTEGER,
    formId: DataTypes.INTEGER,
    formSectionId: DataTypes.INTEGER,
    field_name: DataTypes.STRING,
    display_name: DataTypes.STRING,
    input_type: DataTypes.STRING,
    field_order: DataTypes.STRING,
    is_visible: DataTypes.TINYINT,
    is_field_data_bind: DataTypes.TINYINT,
    bind_data_by: DataTypes.STRING,
    status: DataTypes.TINYINT
  }, {
    sequelize,
    modelName: 'CompanyFormField',
    tableName: 'company_form_fields'
  });
  return CompanyFormField;
};