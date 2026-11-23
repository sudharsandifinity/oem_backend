const BaseService = require("./baseService");
const SAPBaseClient = require('./SapServices/SAPBaseClient');
const AuthService = require('./AuthService');
const { SAPSession, Company } = require('../models');
const { encodeId } = require('../utils/hashids');

const sapProjectsClient = new SAPBaseClient('Projects');
const authService = new AuthService();

const ensureCompanySession = async (req, companyId) => {
    const company = await Company.findByPk(companyId, { attributes: ['id', 'company_db_name'] });
    if (!company) {
        throw new Error('Company not found');
    }
    const session = await SAPSession.findOne({ where: { user_id: req.user.id }, order: [['createdAt', 'DESC']] });
    if (session && session.company_db === company.company_db_name) {
        return;
    }
    await authService.sapLogin({ user: req.user, body: { company_id: encodeId(companyId) } }, req.user.id);
};

const fetchSapProjects = async (req) => {
    const response = await sapProjectsClient.getAll(req, {});
    return response?.data?.value || [];
};

class ProjectService extends BaseService {

    constructor(projectRepository) {
        super(projectRepository);
    }

    async syncProjects(req) {
        const sapProjects = await fetchSapProjects(req);
        if (!sapProjects.length) {
            return { message: "No projects found in SAP", inserted: 0 };
        }
        await this.repository.bulkUpsert(sapProjects);
        return { message: "Projects synced successfully", count: sapProjects.length };
    }

    async syncCompanyProjects(req, companyId) {
        await ensureCompanySession(req, companyId);
        const sapProjects = await fetchSapProjects(req);
        if (!sapProjects.length) {
            return { message: "No projects found in SAP", inserted: 0, updated: 0, deactivated: 0 };
        }
        const { inserted, updated, deactivated } = await this.repository.bulkUpsertByCompany(sapProjects, companyId);
        return { message: "Projects synced successfully", inserted, updated, deactivated };
    }

}

module.exports = ProjectService;
