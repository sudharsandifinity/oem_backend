'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ApprovalRequestAction extends Model {
    static associate(models) {
      ApprovalRequestAction.belongsTo(models.ApprovalRequest, { foreignKey: 'requestId' });
      ApprovalRequestAction.belongsTo(models.User, { foreignKey: 'approverUserId' });
    }
  }
  ApprovalRequestAction.init(
    {
      requestId: DataTypes.INTEGER,
      stageOrder: DataTypes.INTEGER,
      approverUserId: DataTypes.INTEGER,
      decision: DataTypes.STRING,
      remark: DataTypes.TEXT
    },
    {
      sequelize,
      modelName: 'ApprovalRequestAction',
      tableName: 'approval_request_actions',
      timestamps: true
    }
  );
  return ApprovalRequestAction;
};
