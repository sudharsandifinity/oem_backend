const BaseRepository = require('./baseRepository');
const { Project } = require('../models');

class ProjectRepository extends BaseRepository{

    constructor(){
        super(Project);
    }

     async bulkUpsert(projects) {
        for (const project of projects) {
            const payload = {
                Name: project.Name,
                ValidFrom: project.ValidFrom || null,
                ValidTo: project.ValidTo || null,
                Active: project.Active,
            };
            const existing = await Project.findOne({ where: { Code: project.Code } });
            if (existing) {
                await existing.update(payload);
            } else {
                await Project.create({ Code: project.Code, ...payload });
            }
        }
    }

        async bulkUpsertByCompany(projects, companyId) {
        let inserted = 0;
        let updated = 0;
        for (const project of projects) {
            const payload = {
                Name: project.Name,
                ValidFrom: project.ValidFrom || null,
                ValidTo: project.ValidTo || null,
                Active: project.Active,
                companyId,
            };
            const existing = await Project.findOne({ where: { companyId, Code: project.Code } });
            if (existing) {
                await existing.update(payload);
                updated += 1;
            } else {
                await Project.create({ Code: project.Code, ...payload });
                inserted += 1;
            }
        }
        return { inserted, updated };
    }

    async getByCompany(companyId) {
        return await Project.findAll({
            where: { companyId },
            order: [['Code', 'ASC']]
        });
    }

}

module.exports = ProjectRepository;
