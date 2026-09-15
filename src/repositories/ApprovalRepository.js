const {
  sequelize,
  ApprovalFlow,
  ApprovalFlowStage,
  ApprovalRequest,
  ApprovalRequestAction,
  User
} = require('../models');

const userAttrs = ['id', 'first_name', 'last_name', 'email'];

const stagesInclude = {
  model: ApprovalFlowStage,
  as: 'stages',
  include: [
    { model: User, as: 'approver', attributes: userAttrs },
    { model: User, as: 'delegator', attributes: userAttrs }
  ]
};

class ApprovalRepository {
  async getFlow(companyId, docType, projectId) {
    return ApprovalFlow.findOne({
      where: { companyId, docType, projectId },
      include: [stagesInclude]
    });
  }

  async upsertFlow(companyId, docType, projectId, stages = []) {
    await sequelize.transaction(async (t) => {
      let flow = await ApprovalFlow.findOne({ where: { companyId, docType, projectId }, transaction: t });
      if (!flow) {
        flow = await ApprovalFlow.create({ companyId, docType, projectId, status: 1 }, { transaction: t });
      }

      const existing = await ApprovalFlowStage.findAll({ where: { flowId: flow.id }, attributes: ['id'], transaction: t });
      const existingIds = existing.map((s) => s.id);
      if (existingIds.length) {
        await ApprovalFlowStage.destroy({ where: { id: existingIds }, transaction: t });
      }

      for (let i = 0; i < stages.length; i += 1) {
        const stage = stages[i];
        await ApprovalFlowStage.create(
          {
            flowId: flow.id,
            stageOrder: i + 1,
            name: stage.name || `Stage ${i + 1}`,
            approverUserId: stage.approverUserId ?? null,
            delegatorUserId: stage.delegatorUserId ?? null
          },
          { transaction: t }
        );
      }
    });

    return this.getFlow(companyId, docType, projectId);
  }

  async createRequest(data) {
    return ApprovalRequest.create(data);
  }

  async getRequestById(id) {
    return ApprovalRequest.findByPk(id, {
      include: [
        { model: ApprovalFlow, include: [stagesInclude] },
        {
          model: ApprovalRequestAction,
          as: 'actions',
          include: [{ model: User, attributes: userAttrs }]
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
      include: [{ model: ApprovalFlow, include: [stagesInclude] }],
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
