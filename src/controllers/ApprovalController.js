const ApprovalService = require('../services/ApprovalService');
const ApprovalRepository = require('../repositories/ApprovalRepository');
const UserRepository = require('../repositories/userRepository');
const MaterialRequestService = require('../services/SapServices/MaterialRequestService');
const { userService } = require('../routes/v1/admin/userRoutes');
const { encodeId, decodeId } = require('../utils/hashids');

const shapeStages = (flow) =>
  [...(flow?.stages || [])]
    .sort((a, b) => a.stageOrder - b.stageOrder)
    .map((stage) => ({
      stageOrder: stage.stageOrder,
      name: stage.name,
      approvers: (stage.approvers || []).map((a) => ({
        userId: encodeId(a.userId),
        name: [a.User?.first_name, a.User?.last_name].filter(Boolean).join(' '),
        email: a.User?.email ?? ''
      }))
    }));

const shapeActions = (request) =>
  (request.actions || []).map((a) => ({
    stageOrder: a.stageOrder,
    decision: a.decision,
    remark: a.remark ?? '',
    approver: [a.User?.first_name, a.User?.last_name].filter(Boolean).join(' '),
    createdAt: a.createdAt
  }));

class ApprovalController {
  constructor() {
    this.service = new ApprovalService();
    this.repository = new ApprovalRepository();
    this.userRepository = new UserRepository();
    this.materialRequestService = new MaterialRequestService();
  }

  _companyId = async (req) => {
    const ids = await this.userRepository.getUserCompanyIds(req.user.id);
    return ids[0] ?? null;
  };

  _sendError = (res, error, fallback) => {
    if (error?.statusCode) return res.status(error.statusCode).json({ message: error.message });
    console.log(fallback, error);
    return res.status(500).json({ message: fallback });
  };

  _hydrateMR = async (req, request) => {
    try {
      const mr = await this.materialRequestService.getById(req, request.docEntry, {});
      return mr || {};
    } catch {
      return {};
    }
  };

  _approverProjectCodes = async (req) => {
    try {
      const userdetails = await userService.getById(req.user.id);
      return (userdetails.Projects || []).map((p) => p.Code).filter(Boolean);
    } catch {
      return [];
    }
  };

  myPending = async (req, res) => {
    try {
      const docType = req.query.docType || 'MR';
      const allowedStatus = ['pending', 'approved', 'sent_back', 'all'];
      const status = allowedStatus.includes(req.query.status) ? req.query.status : 'pending';
      const effectiveStatus = status === 'all' ? '' : status;
      const { skip = 0, top = 25 } = req.query || {};
      const companyId = await this._companyId(req);
      if (!companyId) return res.status(200).json({ value: [], count: 0 });

      const projectCodes = await this._approverProjectCodes(req);
      if (!projectCodes.length) return res.status(200).json({ value: [], count: 0 });

      const requests = await this.service.getForApprover(companyId, docType, req.user.id, effectiveStatus);
      const hydrated = [];
      for (const request of requests) {
        const mr = await this._hydrateMR(req, request);
        if (!projectCodes.includes(mr.U_PrjCode)) continue;
        hydrated.push({
          ...mr,
          approvalRequestId: encodeId(request.id),
          currentStageOrder: request.currentStageOrder,
          approvalStatus: request.status,
          DocEntry: request.docEntry
        });
      }

      const count = hydrated.length;
      const start = Number(skip) || 0;
      const end = start + (Number(top) || 25);
      const value = hydrated.slice(start, end);

      return res.status(200).json({ value, count });
    } catch (error) {
      return this._sendError(res, error, 'Error while fetching approvals');
    }
  };

  mySentBack = async (req, res) => {
    try {
      const docType = req.query.docType || 'MR';
      const companyId = await this._companyId(req);
      if (!companyId) return res.status(200).json({ value: [], count: 0 });

      const requests = await this.repository.listCreatedBy(companyId, docType, req.user.id, 'sent_back');
      const value = [];
      for (const request of requests) {
        const mr = await this._hydrateMR(req, request);
        value.push({
          ...mr,
          approvalRequestId: encodeId(request.id),
          approvalStatus: request.status,
          DocEntry: request.docEntry
        });
      }
      return res.status(200).json({ value, count: value.length });
    } catch (error) {
      return this._sendError(res, error, 'Error while fetching sent-back requests');
    }
  };

  getRequest = async (req, res) => {
    try {
      const id = decodeId(req.params.id);
      const request = await this.service.getRequestDetail(id);
      const mr = await this._hydrateMR(req, request);

      return res.status(200).json({
        id: encodeId(request.id),
        docType: request.docType,
        docEntry: request.docEntry,
        currentStageOrder: request.currentStageOrder,
        status: request.status,
        createdByUserId: request.createdByUserId,
        stages: shapeStages(request.ApprovalFlow),
        actions: shapeActions(request),
        mr
      });
    } catch (error) {
      return this._sendError(res, error, 'Error while fetching approval request');
    }
  };

  approve = async (req, res) => {
    try {
      const id = decodeId(req.params.id);
      const result = await this.service.approve(req, { requestId: id, userId: req.user.id, remark: req.body?.remark });
      return res.status(200).json(result);
    } catch (error) {
      return this._sendError(res, error, 'Error while approving request');
    }
  };

  reject = async (req, res) => {
    try {
      const id = decodeId(req.params.id);
      const result = await this.service.reject(req, { requestId: id, userId: req.user.id, remark: req.body?.remark });
      return res.status(200).json(result);
    } catch (error) {
      return this._sendError(res, error, 'Error while rejecting request');
    }
  };

  resubmit = async (req, res) => {
    try {
      const id = decodeId(req.params.id);
      const result = await this.service.resubmit(req, { requestId: id, userId: req.user.id });
      return res.status(200).json(result);
    } catch (error) {
      return this._sendError(res, error, 'Error while resubmitting request');
    }
  };
}

module.exports = ApprovalController;
