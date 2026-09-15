'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ApprovalFlowStage extends Model {
    static associate(models) {
      ApprovalFlowStage.belongsTo(models.ApprovalFlow, { foreignKey: 'flowId' });
      ApprovalFlowStage.belongsTo(models.User, { foreignKey: 'approverUserId', as: 'approver' });
      ApprovalFlowStage.belongsTo(models.User, { foreignKey: 'delegatorUserId', as: 'delegator' });
    }
  }
  ApprovalFlowStage.init(
    {
      flowId: DataTypes.INTEGER,
      stageOrder: DataTypes.INTEGER,
      name: DataTypes.STRING,
      approverUserId: DataTypes.INTEGER,
      delegatorUserId: DataTypes.INTEGER
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
