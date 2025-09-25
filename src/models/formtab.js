'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FormTab extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      FormTab.hasMany(models.SubForm, { foreignKey: 'formTabId' });
    }
  }
  FormTab.init({
    name: DataTypes.STRING,
    display_name: DataTypes.STRING,
    formId: DataTypes.INTEGER,
    status: DataTypes.TINYINT
  }, {
    sequelize,
    modelName: 'FormTab',
    tableName: 'form_tabs'
  });
  return FormTab;
};