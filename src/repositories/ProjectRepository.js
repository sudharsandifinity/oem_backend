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
        const normalize = (code) => String(code ?? '').trim().toLowerCase();
        let inserted = 0;
        let updated = 0;
        let deactivated = 0;

        await Project.sequelize.transaction(async (transaction) => {
            const existingRows = await Project.findAll({ where: { companyId }, transaction });
            const existingByCode = new Map(existingRows.map((row) => [normalize(row.Code), row]));
            const sapCodes = new Set();

            for (const project of projects) {
                const code = String(project.Code ?? '').trim();
                if (!code) continue;
                const key = normalize(code);
                if (sapCodes.has(key)) continue;
                sapCodes.add(key);

                const payload = {
                    Code: code,
                    Name: project.Name,
                    ValidFrom: project.ValidFrom || null,
                    ValidTo: project.ValidTo || null,
                    Active: project.Active,
                    companyId,
                };
                const existing = existingByCode.get(key);
                if (existing) {
                    await existing.update(payload, { transaction });
                    updated += 1;
                } else {
                    await Project.create(payload, { transaction });
                    inserted += 1;
                }
            }

            for (const row of existingRows) {
                if (sapCodes.has(normalize(row.Code)) || row.Active === 'tNO') continue;
                await row.update({ Active: 'tNO' }, { transaction });
                deactivated += 1;
            }
        });

        return { inserted, updated, deactivated };
    }

    async getByCompany(companyId) {
        return await Project.findAll({
            where: { companyId },
            order: [['Code', 'ASC']]
        });
    }

}

module.exports = ProjectRepository;
