'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SubForm extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SubForm.hasMany(models.FormField, {foreignKey: 'subFormId'});
    }
  }
  SubForm.init({
    formTabId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    display_name: DataTypes.STRING,
    status: DataTypes.TINYINT
  }, {
    sequelize,
    modelName: 'SubForm',
    tableName: 'sub_forms'
  });
  return SubForm;
};