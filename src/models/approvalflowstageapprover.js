'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ApprovalFlowStageApprover extends Model {
    static associate(models) {
      ApprovalFlowStageApprover.belongsTo(models.ApprovalFlowStage, { foreignKey: 'stageId' });
      ApprovalFlowStageApprover.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  ApprovalFlowStageApprover.init(
    {
      stageId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'ApprovalFlowStageApprover',
      tableName: 'approval_flow_stage_approvers',
      timestamps: true
    }
  );
  return ApprovalFlowStageApprover;
};
