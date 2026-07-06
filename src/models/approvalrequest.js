'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ApprovalRequest extends Model {
    static associate(models) {
      ApprovalRequest.belongsTo(models.ApprovalFlow, { foreignKey: 'flowId' });
      ApprovalRequest.hasMany(models.ApprovalRequestAction, { foreignKey: 'requestId', as: 'actions' });
    }
  }
  ApprovalRequest.init(
    {
      companyId: DataTypes.INTEGER,
      docType: DataTypes.STRING,
      docEntry: DataTypes.INTEGER,
      flowId: DataTypes.INTEGER,
      currentStageOrder: { type: DataTypes.INTEGER, defaultValue: 1 },
      status: { type: DataTypes.STRING, defaultValue: 'pending' },
      createdByUserId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'ApprovalRequest',
      tableName: 'approval_requests',
      timestamps: true
    }
  );
  return ApprovalRequest;
};
