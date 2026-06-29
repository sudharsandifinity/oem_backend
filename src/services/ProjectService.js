const BaseService = require("./baseService");
const SAPBaseClient = require('./SapServices/SAPBaseClient');

const sapProjectsClient = new SAPBaseClient('Projects');

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
        const sapProjects = await fetchSapProjects(req);
        if (!sapProjects.length) {
            return { message: "No projects found in SAP", inserted: 0, updated: 0 };
        }
        const { inserted, updated } = await this.repository.bulkUpsertByCompany(sapProjects, companyId);
        return { message: "Projects synced successfully", inserted, updated };
    }

}

module.exports = ProjectService;
