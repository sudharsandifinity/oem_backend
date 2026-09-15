'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropTable('approval_flow_stage_approvers');

    await queryInterface.bulkDelete('approval_request_actions', null, {});
    await queryInterface.bulkDelete('approval_requests', null, {});
    await queryInterface.bulkDelete('approval_flow_stages', null, {});
    await queryInterface.bulkDelete('approval_flows', null, {});

    await queryInterface.addColumn('approval_flows', 'projectId', {
      type: Sequelize.INTEGER,
      allowNull: false
    });

    await queryInterface.removeConstraint('approval_flows', 'uq_approval_flows_company_docType');

    await queryInterface.addConstraint('approval_flows', {
      fields: ['projectId'],
      type: 'foreign key',
      name: 'fk_approval_flows_projectId',
      references: { table: 'projects', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'NO ACTION'
    });

    await queryInterface.addConstraint('approval_flows', {
      fields: ['companyId', 'docType', 'projectId'],
      type: 'unique',
      name: 'uq_approval_flows_company_docType_project'
    });

    await queryInterface.addColumn('approval_flow_stages', 'approverUserId', {
      type: Sequelize.INTEGER,
      allowNull: false
    });

    await queryInterface.addColumn('approval_flow_stages', 'delegatorUserId', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.addConstraint('approval_flow_stages', {
      fields: ['approverUserId'],
      type: 'foreign key',
      name: 'fk_approval_flow_stages_approverUserId',
      references: { table: 'users', field: 'id' },
      onUpdate: 'NO ACTION',
      onDelete: 'NO ACTION'
    });

    await queryInterface.addConstraint('approval_flow_stages', {
      fields: ['delegatorUserId'],
      type: 'foreign key',
      name: 'fk_approval_flow_stages_delegatorUserId',
      references: { table: 'users', field: 'id' },
      onUpdate: 'NO ACTION',
      onDelete: 'NO ACTION'
    });

    await queryInterface.addColumn('approval_request_actions', 'actedAs', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('approval_request_actions', 'actedAs');

    await queryInterface.removeConstraint('approval_flow_stages', 'fk_approval_flow_stages_delegatorUserId');
    await queryInterface.removeConstraint('approval_flow_stages', 'fk_approval_flow_stages_approverUserId');
    await queryInterface.removeColumn('approval_flow_stages', 'delegatorUserId');
    await queryInterface.removeColumn('approval_flow_stages', 'approverUserId');

    await queryInterface.removeConstraint('approval_flows', 'uq_approval_flows_company_docType_project');
    await queryInterface.removeConstraint('approval_flows', 'fk_approval_flows_projectId');
    await queryInterface.removeColumn('approval_flows', 'projectId');

    await queryInterface.addConstraint('approval_flows', {
      fields: ['companyId', 'docType'],
      type: 'unique',
      name: 'uq_approval_flows_company_docType'
    });

    await queryInterface.createTable('approval_flow_stage_approvers', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      stageId: { type: Sequelize.INTEGER, allowNull: false },
      userId: { type: Sequelize.INTEGER, allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });

    await queryInterface.addConstraint('approval_flow_stage_approvers', {
      fields: ['stageId'],
      type: 'foreign key',
      name: 'fk_approval_stage_approvers_stageId',
      references: { table: 'approval_flow_stages', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    await queryInterface.addConstraint('approval_flow_stage_approvers', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_approval_stage_approvers_userId',
      references: { table: 'users', field: 'id' },
      onUpdate: 'NO ACTION',
      onDelete: 'NO ACTION'
    });
  }
};
