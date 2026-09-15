'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ApprovalFlow extends Model {
    static associate(models) {
      ApprovalFlow.belongsTo(models.Company, { foreignKey: 'companyId' });
      ApprovalFlow.belongsTo(models.Project, { foreignKey: 'projectId' });
      ApprovalFlow.hasMany(models.ApprovalFlowStage, { foreignKey: 'flowId', as: 'stages' });
      ApprovalFlow.hasMany(models.ApprovalRequest, { foreignKey: 'flowId' });
    }
  }
  ApprovalFlow.init(
    {
      companyId: DataTypes.INTEGER,
      projectId: DataTypes.INTEGER,
      docType: DataTypes.STRING,
      status: { type: DataTypes.INTEGER, defaultValue: 1 }
    },
    {
      sequelize,
      modelName: 'ApprovalFlow',
      tableName: 'approval_flows',
      timestamps: true
    }
  );
  return ApprovalFlow;
};
