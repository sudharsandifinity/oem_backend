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
      Form.belongsTo(models.Company, { foreignKey: 'companyId' });
      Form.belongsTo(models.Branch, { foreignKey: 'branchId' });
    }
  }
  Form.init({
    parentFormId: DataTypes.INTEGER,
    companyId: DataTypes.INTEGER,
    branchId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    display_name: DataTypes.STRING,
    scope: DataTypes.ENUM('global', 'company', 'branch'),
    form_type: DataTypes.STRING,
    status: DataTypes.TINYINT
  }, {
    sequelize,
    modelName: 'Form',
    tableName: 'forms'
  });
  return Form;
};