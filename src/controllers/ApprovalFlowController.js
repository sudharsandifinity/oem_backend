const ApprovalRepository = require('../repositories/ApprovalRepository');
const UserRepository = require('../repositories/userRepository');
const { encodeId, decodeId } = require('../utils/hashids');

const shapeUser = (user, userId) =>
  user
    ? {
        userId: encodeId(userId),
        name: [user.first_name, user.last_name].filter(Boolean).join(' '),
        email: user.email ?? ''
      }
    : null;

const shapeFlow = (flow, docType, projectId) => {
  if (!flow) return { docType, projectId, stages: [] };
  const stages = [...(flow.stages || [])]
    .sort((a, b) => a.stageOrder - b.stageOrder)
    .map((stage) => ({
      stageOrder: stage.stageOrder,
      name: stage.name,
      approver: shapeUser(stage.approver, stage.approverUserId),
      delegator: shapeUser(stage.delegator, stage.delegatorUserId)
    }));
  return { docType, projectId: encodeId(flow.projectId), stages };
};

class ApprovalFlowController {
  constructor() {
    this.repository = new ApprovalRepository();
    this.userRepository = new UserRepository();
  }

  _companyId = async (req) => {
    const ids = await this.userRepository.getUserCompanyIds(req.user.id);
    return ids[0] ?? null;
  };

  getFlow = async (req, res) => {
    try {
      const docType = req.query.docType || 'MR';
      const projectId = decodeId(req.query.projectId);
      const companyId = await this._companyId(req);
      if (!companyId || projectId == null) {
        return res.status(200).json({ docType, projectId: req.query.projectId ?? null, stages: [] });
      }

      const flow = await this.repository.getFlow(companyId, docType, projectId);
      return res.status(200).json(shapeFlow(flow, docType, req.query.projectId));
    } catch (error) {
      console.log('Error while getting approval flow', error);
      return res.status(500).json({ message: 'Internal Server Error', error: error?.original?.message || error?.message });
    }
  };

  saveFlow = async (req, res) => {
    try {
      const docType = req.body.docType || 'MR';
      const projectId = decodeId(req.body.projectId);
      const companyId = await this._companyId(req);
      if (!companyId) return res.status(400).json({ message: 'Company not found for this admin' });
      if (projectId == null) return res.status(400).json({ message: 'Project is required' });

      const stages = (req.body.stages || []).map((stage) => ({
        name: stage.name,
        approverUserId: decodeId(stage.approverUserId),
        delegatorUserId: stage.delegatorUserId ? decodeId(stage.delegatorUserId) : null
      }));

      const invalid = stages.find((s) => s.approverUserId == null);
      if (invalid) return res.status(400).json({ message: 'Each stage requires an approver' });

      const flow = await this.repository.upsertFlow(companyId, docType, projectId, stages);
      return res.status(200).json(shapeFlow(flow, docType, req.body.projectId));
    } catch (error) {
      console.log('Error while saving approval flow', error);
      return res.status(500).json({ message: 'Internal Server Error', error: error?.original?.message || error?.message });
    }
  };
}

module.exports = ApprovalFlowController;
