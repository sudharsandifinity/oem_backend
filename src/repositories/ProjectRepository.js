const BaseRepository = require('./baseRepository');
const { Project } = require('../models');

class ProjectRepository extends BaseRepository{

    constructor(){
        super(Project);
    }

    async bulkUpsert(projects) {
        for (const project of projects) {
            await Project.upsert({
                Code: project.Code,
                Name: project.Name,
                ValidFrom: project.ValidFrom || null,
                ValidTo: project.ValidTo || null,
                Active: project.Active,
            });
        }
    }

}

module.exports = ProjectRepository;