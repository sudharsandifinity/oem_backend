const { decodeId, encodeId } = require("../utils/hashids");
const BaseService = require("./baseService");
const SapProjectService = require('./SapServices/ProjectService');
const sapProjectService = new SapProjectService();
const SapProjectConroller = require('../controllers/SapControllers/SapProjectController');
const sapProjectConroller = new SapProjectConroller();


class ProjectService extends BaseService{

    constructor(projectRepository){
        super(projectRepository);
    }

    async syncProjects(req) {
        
        const sapProjects = await sapProjectConroller.getAll(req, req);

        if (!sapProjects || !sapProjects.length) {
        return {
            message: "No projects found in SAP",
            inserted: 0,
        };
        }

        await this.repository.bulkUpsert(sapProjects);

        return {
            message: "Projects synced successfully",
            count: sapProjects.length,
        };
    }

}

module.exports = ProjectService;