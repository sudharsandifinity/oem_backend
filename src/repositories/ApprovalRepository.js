const {
  sequelize,
  ApprovalFlow,
  ApprovalFlowStage,
  ApprovalFlowStageApprover,
  ApprovalRequest,
  ApprovalRequestAction,
  User
} = require('../models');

const approverInclude = {
  model: ApprovalFlowStage,
  as: 'stages',
  include: [
    {
      model: ApprovalFlowStageApprover,
      as: 'approvers',
      include: [{ model: User, attributes: ['id', 'first_name', 'last_name', 'email'] }]
    }
  ]
};

class ApprovalRepository {
  async getFlow(companyId, docType) {
    return ApprovalFlow.findOne({
      where: { companyId, docType },
      include: [approverInclude]
    });
  }

  async upsertFlow(companyId, docType, stages = []) {
    await sequelize.transaction(async (t) => {
      let flow = await ApprovalFlow.findOne({ where: { companyId, docType }, transaction: t });
      if (!flow) {
        flow = await ApprovalFlow.create({ companyId, docType, status: 1 }, { transaction: t });
      }

      const existing = await ApprovalFlowStage.findAll({ where: { flowId: flow.id }, attributes: ['id'], transaction: t });
      const existingIds = existing.map((s) => s.id);
      if (existingIds.length) {
        await ApprovalFlowStageApprover.destroy({ where: { stageId: existingIds }, transaction: t });
        await ApprovalFlowStage.destroy({ where: { id: existingIds }, transaction: t });
      }

      for (let i = 0; i < stages.length; i += 1) {
        const stage = stages[i];
        const created = await ApprovalFlowStage.create(
          { flowId: flow.id, stageOrder: i + 1, name: stage.name || `Stage ${i + 1}` },
          { transaction: t }
        );
        const approverIds = [...new Set((stage.approverUserIds || []).filter(Boolean))];
        if (approverIds.length) {
          await ApprovalFlowStageApprover.bulkCreate(
            approverIds.map((userId) => ({ stageId: created.id, userId })),
            { transaction: t }
          );
        }
      }
    });

    return this.getFlow(companyId, docType);
  }

  async createRequest(data) {
    return ApprovalRequest.create(data);
  }

  async getRequestById(id) {
    return ApprovalRequest.findByPk(id, {
      include: [
        { model: ApprovalFlow, include: [approverInclude] },
        {
          model: ApprovalRequestAction,
          as: 'actions',
          include: [{ model: User, attributes: ['id', 'first_name', 'last_name', 'email'] }]
        }
      ],
      order: [[{ model: ApprovalRequestAction, as: 'actions' }, 'createdAt', 'ASC']]
    });
  }

  async getRequestByDoc(docType, docEntry) {
    return ApprovalRequest.findOne({ where: { docType, docEntry } });
  }

  async listByCompanyDocType(companyId, docType, status) {
    const where = { companyId, docType };
    if (status) where.status = status;
    return ApprovalRequest.findAll({
      where,
      include: [{ model: ApprovalFlow, include: [approverInclude] }],
      order: [['docEntry', 'DESC']]
    });
  }

  async listCreatedBy(companyId, docType, createdByUserId, status) {
    const where = { companyId, docType, createdByUserId };
    if (status) where.status = status;
    return ApprovalRequest.findAll({ where, order: [['docEntry', 'DESC']] });
  }

  async updateRequest(id, data) {
    const record = await ApprovalRequest.findByPk(id);
    if (!record) return null;
    return record.update(data);
  }

  async addAction(data) {
    return ApprovalRequestAction.create(data);
  }
}

module.exports = ApprovalRepository;
