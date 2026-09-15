'use strict';
/** @type {import('sequelize-cli').Migration} */

const steps = (queryInterface) => {
  const run = async (label, sql) => {
    console.log(`   step: ${label}`);
    await queryInterface.sequelize.query(sql);
  };
  return run;
};

module.exports = {
  async up(queryInterface) {
    const run = steps(queryInterface);

    await run(
      'drop approval_flow_stage_approvers',
      `IF OBJECT_ID('approval_flow_stage_approvers','U') IS NOT NULL DROP TABLE [approval_flow_stage_approvers];`
    );

    await run('clear approval_request_actions', `DELETE FROM [approval_request_actions];`);
    await run('clear approval_requests', `DELETE FROM [approval_requests];`);
    await run('clear approval_flow_stages', `DELETE FROM [approval_flow_stages];`);
    await run('clear approval_flows', `DELETE FROM [approval_flows];`);

    await run(
      'add approval_flows.projectId',
      `IF COL_LENGTH('approval_flows','projectId') IS NULL ALTER TABLE [approval_flows] ADD [projectId] INT NULL;`
    );

    await run(
      'drop old unique constraint (companyId,docType)',
      `IF EXISTS (SELECT 1 FROM sys.objects WHERE name = 'uq_approval_flows_company_docType' AND parent_object_id = OBJECT_ID('approval_flows'))
         ALTER TABLE [approval_flows] DROP CONSTRAINT [uq_approval_flows_company_docType];`
    );

    await run(
      'drop old unique index (companyId,docType) if index-based',
      `IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'uq_approval_flows_company_docType' AND object_id = OBJECT_ID('approval_flows'))
         DROP INDEX [uq_approval_flows_company_docType] ON [approval_flows];`
    );

    await run(
      'add FK approval_flows.projectId -> projects.id',
      `IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'fk_approval_flows_projectId')
         ALTER TABLE [approval_flows] ADD CONSTRAINT [fk_approval_flows_projectId]
         FOREIGN KEY ([projectId]) REFERENCES [projects]([id]);`
    );

    await run(
      'add unique (companyId,docType,projectId)',
      `IF NOT EXISTS (SELECT 1 FROM sys.objects WHERE name = 'uq_approval_flows_company_docType_project')
         ALTER TABLE [approval_flows] ADD CONSTRAINT [uq_approval_flows_company_docType_project]
         UNIQUE ([companyId],[docType],[projectId]);`
    );

    await run(
      'add approval_flow_stages.approverUserId',
      `IF COL_LENGTH('approval_flow_stages','approverUserId') IS NULL ALTER TABLE [approval_flow_stages] ADD [approverUserId] INT NULL;`
    );

    await run(
      'add approval_flow_stages.delegatorUserId',
      `IF COL_LENGTH('approval_flow_stages','delegatorUserId') IS NULL ALTER TABLE [approval_flow_stages] ADD [delegatorUserId] INT NULL;`
    );

    await run(
      'add FK approval_flow_stages.approverUserId -> users.id',
      `IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'fk_approval_flow_stages_approverUserId')
         ALTER TABLE [approval_flow_stages] ADD CONSTRAINT [fk_approval_flow_stages_approverUserId]
         FOREIGN KEY ([approverUserId]) REFERENCES [users]([id]);`
    );

    await run(
      'add FK approval_flow_stages.delegatorUserId -> users.id',
      `IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'fk_approval_flow_stages_delegatorUserId')
         ALTER TABLE [approval_flow_stages] ADD CONSTRAINT [fk_approval_flow_stages_delegatorUserId]
         FOREIGN KEY ([delegatorUserId]) REFERENCES [users]([id]);`
    );

    await run(
      'add approval_request_actions.actedAs',
      `IF COL_LENGTH('approval_request_actions','actedAs') IS NULL ALTER TABLE [approval_request_actions] ADD [actedAs] NVARCHAR(255) NULL;`
    );
  },

  async down(queryInterface) {
    const run = steps(queryInterface);

    await run(
      'drop actedAs',
      `IF COL_LENGTH('approval_request_actions','actedAs') IS NOT NULL ALTER TABLE [approval_request_actions] DROP COLUMN [actedAs];`
    );

    await run(
      'drop FK delegatorUserId',
      `IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'fk_approval_flow_stages_delegatorUserId')
         ALTER TABLE [approval_flow_stages] DROP CONSTRAINT [fk_approval_flow_stages_delegatorUserId];`
    );

    await run(
      'drop FK approverUserId',
      `IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'fk_approval_flow_stages_approverUserId')
         ALTER TABLE [approval_flow_stages] DROP CONSTRAINT [fk_approval_flow_stages_approverUserId];`
    );

    await run(
      'drop delegatorUserId',
      `IF COL_LENGTH('approval_flow_stages','delegatorUserId') IS NOT NULL ALTER TABLE [approval_flow_stages] DROP COLUMN [delegatorUserId];`
    );

    await run(
      'drop approverUserId',
      `IF COL_LENGTH('approval_flow_stages','approverUserId') IS NOT NULL ALTER TABLE [approval_flow_stages] DROP COLUMN [approverUserId];`
    );

    await run(
      'drop unique (companyId,docType,projectId)',
      `IF EXISTS (SELECT 1 FROM sys.objects WHERE name = 'uq_approval_flows_company_docType_project')
         ALTER TABLE [approval_flows] DROP CONSTRAINT [uq_approval_flows_company_docType_project];`
    );

    await run(
      'drop FK projectId',
      `IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'fk_approval_flows_projectId')
         ALTER TABLE [approval_flows] DROP CONSTRAINT [fk_approval_flows_projectId];`
    );

    await run(
      'drop projectId',
      `IF COL_LENGTH('approval_flows','projectId') IS NOT NULL ALTER TABLE [approval_flows] DROP COLUMN [projectId];`
    );

    await run(
      'restore unique (companyId,docType)',
      `IF NOT EXISTS (SELECT 1 FROM sys.objects WHERE name = 'uq_approval_flows_company_docType')
         ALTER TABLE [approval_flows] ADD CONSTRAINT [uq_approval_flows_company_docType] UNIQUE ([companyId],[docType]);`
    );

    await run(
      'recreate approval_flow_stage_approvers',
      `IF OBJECT_ID('approval_flow_stage_approvers','U') IS NULL
         CREATE TABLE [approval_flow_stage_approvers] (
           [id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
           [stageId] INT NOT NULL,
           [userId] INT NOT NULL,
           [createdAt] DATETIMEOFFSET NOT NULL,
           [updatedAt] DATETIMEOFFSET NOT NULL,
           CONSTRAINT [fk_approval_stage_approvers_stageId] FOREIGN KEY ([stageId]) REFERENCES [approval_flow_stages]([id]) ON DELETE CASCADE,
           CONSTRAINT [fk_approval_stage_approvers_userId] FOREIGN KEY ([userId]) REFERENCES [users]([id])
         );`
    );
  }
};
