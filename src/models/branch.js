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
    name: DataTypes.STRING,
    city: DataTypes.STRING,
    address: DataTypes.TEXT,
    status: DataTypes.TINYINT
  }, {
    sequelize,
    modelName: 'Branch',
    tableName: 'branches'
  });
  return Branch;
};