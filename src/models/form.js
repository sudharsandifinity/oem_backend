'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Form extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Form.init({
    name: DataTypes.STRING,
    display_name: DataTypes.STRING,
    status: DataTypes.TINYINT
  }, {
    sequelize,
    modelName: 'Form',
    tableName: 'forms'
  });
  return Form;
};