const ApprovalRepository = require('../repositories/ApprovalRepository');
const MaterialRequestService = require('./SapServices/MaterialRequestService');

const httpError = (message, statusCode) => Object.assign(new Error(message), { statusCode });

const sortStages = (flow) => [...(flow?.stages || [])].sort((a, b) => a.stageOrder - b.stageOrder);

const stageApproverIds = (stage) => (stage?.approvers || []).map((a) => a.userId);

class ApprovalService {
  constructor() {
    this.repository = new ApprovalRepository();
    this.materialRequestService = new MaterialRequestService();
  }

  async initiate(req, { companyId, docType, docEntry, createdByUserId }) {
    if (docEntry == null) return null;

    const flow = companyId ? await this.repository.getFlow(companyId, docType) : null;
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
        return current && stageApproverIds(current).includes(userId);
      });
    }

    return requests.filter((r) => {
      const stages = sortStages(r.ApprovalFlow);
      return stages.some((s) => stageApproverIds(s).includes(userId));
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
    if (!current || !stageApproverIds(current).includes(userId)) {
      throw httpError('You are not an approver for the current stage', 403);
    }
    return { stages, current };
  }

  async approve(req, { requestId, userId, remark }) {
    const request = await this.repository.getRequestById(requestId);
    if (!request) throw httpError('Approval request not found', 404);

    const { stages } = this._assertCurrentStageApprover(request, userId);

    await this.repository.addAction({
      requestId: request.id,
      stageOrder: request.currentStageOrder,
      approverUserId: userId,
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

    this._assertCurrentStageApprover(request, userId);

    await this.repository.addAction({
      requestId: request.id,
      stageOrder: request.currentStageOrder,
      approverUserId: userId,
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
