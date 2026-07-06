const ApprovalRepository = require('../repositories/ApprovalRepository');
const UserRepository = require('../repositories/userRepository');
const { encodeId, decodeId } = require('../utils/hashids');

const shapeFlow = (flow, docType) => {
  if (!flow) return { docType, stages: [] };
  const stages = [...(flow.stages || [])]
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
  return { docType, stages };
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
      const companyId = await this._companyId(req);
      if (!companyId) return res.status(200).json({ docType, stages: [] });

      const flow = await this.repository.getFlow(companyId, docType);
      return res.status(200).json(shapeFlow(flow, docType));
    } catch (error) {
      console.log('Error while getting approval flow', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  saveFlow = async (req, res) => {
    try {
      const docType = req.body.docType || 'MR';
      const companyId = await this._companyId(req);
      if (!companyId) return res.status(400).json({ message: 'Company not found for this admin' });

      const stages = (req.body.stages || []).map((stage) => ({
        name: stage.name,
        approverUserIds: (stage.approverUserIds || []).map((hid) => decodeId(hid)).filter((v) => v != null)
      }));

      const flow = await this.repository.upsertFlow(companyId, docType, stages);
      return res.status(200).json(shapeFlow(flow, docType));
    } catch (error) {
      console.log('Error while saving approval flow', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
}

module.exports = ApprovalFlowController;
