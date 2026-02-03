'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserBranch extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserBranch.belongsTo(models.User);
      UserBranch.belongsTo(models.Branch);
      UserBranch.belongsTo(models.Company);
    }
  }
  UserBranch.init({
    userId: DataTypes.INTEGER,
    branchId: DataTypes.INTEGER,
    companyId: DataTypes.INTEGER,
    sap_emp_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UserBranch',
    tableName: 'user_branches'
  });
  return UserBranch;
};