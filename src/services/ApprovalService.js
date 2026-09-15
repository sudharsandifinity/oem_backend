const ApprovalRepository = require('../repositories/ApprovalRepository');
const MaterialRequestService = require('./SapServices/MaterialRequestService');
const { Project } = require('../models');

const httpError = (message, statusCode) => Object.assign(new Error(message), { statusCode });

const sortStages = (flow) => [...(flow?.stages || [])].sort((a, b) => a.stageOrder - b.stageOrder);

const stageActorIds = (stage) => [stage?.approverUserId, stage?.delegatorUserId].filter((id) => id != null);

const actorRole = (stage, userId) => {
  if (stage?.approverUserId === userId) return 'approver';
  if (stage?.delegatorUserId === userId) return 'delegator';
  return null;
};

class ApprovalService {
  constructor() {
    this.repository = new ApprovalRepository();
    this.materialRequestService = new MaterialRequestService();
  }

  async _resolveProjectId(companyId, projectCode) {
    if (!companyId || !projectCode) return null;
    const project = await Project.findOne({ where: { companyId, Code: projectCode }, attributes: ['id'], raw: true });
    return project?.id ?? null;
  }

  async initiate(req, { companyId, docType, docEntry, createdByUserId, projectCode }) {
    if (docEntry == null) return null;

    const projectId = await this._resolveProjectId(companyId, projectCode);
    const flow = projectId ? await this.repository.getFlow(companyId, docType, projectId) : null;
    if (!flow || !(flow.stages || []).length) {
      await this.finalizeDoc(req, docType, docEntry);
      return null;
    }

    const existing = await this.repository.getRequestByDoc(docType, docEntry);
    if (existing) return existing;

    const request = await this.repository.createRequest({
      companyId,
      docType,
      docEntry,
      flowId: flow.id,
      currentStageOrder: 1,
      status: 'pending',
      createdByUserId: createdByUserId ?? null
    });

    this.notifyStageApprovers(flow, 1);
    return request;
  }

  async getPendingForApprover(companyId, docType, userId) {
    return this.getForApprover(companyId, docType, userId, 'pending');
  }

    async getForApprover(companyId, docType, userId, status = 'pending') {
    const requests = await this.repository.listByCompanyDocType(companyId, docType, status || undefined);

    if (status === 'pending') {
      return requests.filter((r) => {
        const stages = sortStages(r.ApprovalFlow);
        const current = stages.find((s) => s.stageOrder === r.currentStageOrder);
        return current && stageActorIds(current).includes(userId);
      });
    }

    return requests.filter((r) => {
      const stages = sortStages(r.ApprovalFlow);
      return stages.some((s) => stageActorIds(s).includes(userId));
    });
  }

  async getRequestDetail(id) {
    const request = await this.repository.getRequestById(id);
    if (!request) throw httpError('Approval request not found', 404);
    return request;
  }

  _assertCurrentStageApprover(request, userId) {
    if (request.status !== 'pending') {
      throw httpError('This request is not awaiting approval', 409);
    }
    const stages = sortStages(request.ApprovalFlow);
    const current = stages.find((s) => s.stageOrder === request.currentStageOrder);
    const role = current ? actorRole(current, userId) : null;
    if (!role) {
      throw httpError('You are not an approver for the current stage', 403);
    }
    return { stages, current, actedAs: role };
  }

  async approve(req, { requestId, userId, remark }) {
    const request = await this.repository.getRequestById(requestId);
    if (!request) throw httpError('Approval request not found', 404);

    const { stages, actedAs } = this._assertCurrentStageApprover(request, userId);

    await this.repository.addAction({
      requestId: request.id,
      stageOrder: request.currentStageOrder,
      approverUserId: userId,
      actedAs,
      decision: 'approved',
      remark: remark ?? null
    });

    const maxOrder = stages[stages.length - 1]?.stageOrder ?? request.currentStageOrder;
    const isLast = request.currentStageOrder >= maxOrder;

    if (isLast) {
      const finalizeResult = await this.finalize(req, request, remark);
      await this.repository.updateRequest(request.id, { status: 'approved' });
      return { status: 'approved', ...finalizeResult };
    }

    const nextStageOrder = request.currentStageOrder + 1;
    await this.repository.updateRequest(request.id, { currentStageOrder: nextStageOrder });
    this.notifyStageApprovers(request.ApprovalFlow, nextStageOrder);
    return { status: 'pending', currentStageOrder: nextStageOrder };
  }

  async reject(req, { requestId, userId, remark }) {
    const request = await this.repository.getRequestById(requestId);
    if (!request) throw httpError('Approval request not found', 404);

    const { actedAs } = this._assertCurrentStageApprover(request, userId);

    await this.repository.addAction({
      requestId: request.id,
      stageOrder: request.currentStageOrder,
      approverUserId: userId,
      actedAs,
      decision: 'rejected',
      remark: remark ?? null
    });

    await this.repository.updateRequest(request.id, { status: 'sent_back', currentStageOrder: 1 });
    this.notifyRequestor(request);
    return { status: 'sent_back' };
  }

  async resubmit(req, { requestId, userId }) {
    const request = await this.repository.getRequestById(requestId);
    if (!request) throw httpError('Approval request not found', 404);
    if (request.status !== 'sent_back') {
      throw httpError('Only sent-back requests can be resubmitted', 409);
    }
    if (request.createdByUserId && request.createdByUserId !== userId) {
      throw httpError('Only the requestor can resubmit', 403);
    }

    await this.repository.updateRequest(request.id, { status: 'pending', currentStageOrder: 1 });
    this.notifyStageApprovers(request.ApprovalFlow, 1);
    return { status: 'pending' };
  }

  async finalize(req, request, remark) {
    return this.finalizeDoc(req, request.docType, request.docEntry, remark);
  }

  async finalizeDoc(req, docType, docEntry, remark) {
    if (docType === 'MR') {
      const mr = await this.materialRequestService.getById(req, docEntry, {});
      return this.materialRequestService.finalizeApproval(req, mr, remark);
    }
    return {};
  }

  notifyStageApprovers() {}
  notifyRequestor() {}
}

module.exports = ApprovalService;
