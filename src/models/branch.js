'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Branch extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Branch.belongsTo(models.Company);
    }
  }
  Branch.init({
    companyId: DataTypes.INTEGER,
    branch_code: DataTypes.STRING,
    is_main: DataTypes.BOOLEAN,
    name: DataTypes.STRING,
    city: DataTypes.STRING,
    address: DataTypes.TEXT,
    country: DataTypes.STRING,
    status: DataTypes.TINYINT
  }, {
    sequelize,
    modelName: 'Branch',
    tableName: 'branches'
  });
  return Branch;
};