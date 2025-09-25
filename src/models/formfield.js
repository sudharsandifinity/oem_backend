'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FormField extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      FormField.belongsTo(models.Form, { foreignKey: 'subFormId' });
      FormField.belongsTo(models.FormSection, { foreignKey: 'formSectionId' });
    }
  }
  FormField.init({
    subFormId: DataTypes.INTEGER,
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
    modelName: 'FormField',
    tableName: 'form_fields'
  });
  return FormField;
};