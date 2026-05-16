const BaseController = require("./BaseController");

class ProjectContoller extends BaseController{

    constructor(projectService){
        super(projectService, 'Project');
    }

    syncProjects = async (req, res) => {

        try{
            const projects = await this.service.syncProjects(req);
            return res.status(200).json(projects);
        }catch(error){
            this.handleError(res, `getting error while sync projects`, error);
        }
        
    }

}

module.exports = ProjectContoller;