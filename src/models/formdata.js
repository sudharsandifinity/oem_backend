'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FormData extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FormData.init({
    module: DataTypes.TEXT,
    DocEntry: DataTypes.INTEGER,
    data: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'FormData',
    tableName: 'form_datas'
  });
  return FormData;
};