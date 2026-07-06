'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ApprovalFlowStage extends Model {
    static associate(models) {
      ApprovalFlowStage.belongsTo(models.ApprovalFlow, { foreignKey: 'flowId' });
      ApprovalFlowStage.hasMany(models.ApprovalFlowStageApprover, { foreignKey: 'stageId', as: 'approvers' });
    }
  }
  ApprovalFlowStage.init(
    {
      flowId: DataTypes.INTEGER,
      stageOrder: DataTypes.INTEGER,
      name: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'ApprovalFlowStage',
      tableName: 'approval_flow_stages',
      timestamps: true
    }
  );
  return ApprovalFlowStage;
};
