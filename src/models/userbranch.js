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
    }
  }
  UserBranch.init({
    userId: DataTypes.INTEGER,
    branchId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'UserBranch',
    tableName: 'user_branches'
  });
  return UserBranch;
};