'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AttendanceRegularizationDraft extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AttendanceRegularizationDraft.init({
      Code: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      Name: DataTypes.STRING,
      U_EmpID: DataTypes.STRING,
      U_PrjCode: DataTypes.STRING,
      U_PrjName: DataTypes.STRING,
      U_Task: DataTypes.STRING,
      U_InTime: DataTypes.STRING,
      U_OutTime: DataTypes.STRING,
      U_AttDt: DataTypes.STRING,
      U_OAttDt: DataTypes.STRING,
      U_ApprSts: DataTypes.STRING,
      U_IsReSub: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'AttendanceRegularizationDraft',
    tableName: 'attendance_regularization_drafts'
  });
  return AttendanceRegularizationDraft;
};
