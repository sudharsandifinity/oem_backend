'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('approval_flows', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      companyId: { type: Sequelize.INTEGER, allowNull: false },
      docType: { type: Sequelize.STRING, allowNull: false },
      status: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });

    await queryInterface.addConstraint('approval_flows', {
      fields: ['companyId'],
      type: 'foreign key',
      name: 'fk_approval_flows_companyId',
      references: { table: 'companies', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'NO ACTION'
    });

    await queryInterface.addConstraint('approval_flows', {
      fields: ['companyId', 'docType'],
      type: 'unique',
      name: 'uq_approval_flows_company_docType'
    });

    await queryInterface.createTable('approval_flow_stages', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      flowId: { type: Sequelize.INTEGER, allowNull: false },
      stageOrder: { type: Sequelize.INTEGER, allowNull: false },
      name: { type: Sequelize.STRING, allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });

    await queryInterface.addConstraint('approval_flow_stages', {
      fields: ['flowId'],
      type: 'foreign key',
      name: 'fk_approval_flow_stages_flowId',
      references: { table: 'approval_flows', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
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

    await queryInterface.createTable('approval_requests', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      companyId: { type: Sequelize.INTEGER, allowNull: false },
      docType: { type: Sequelize.STRING, allowNull: false },
      docEntry: { type: Sequelize.INTEGER, allowNull: false },
      flowId: { type: Sequelize.INTEGER, allowNull: false },
      currentStageOrder: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      status: { type: Sequelize.STRING, allowNull: false, defaultValue: 'pending' },
      createdByUserId: { type: Sequelize.INTEGER, allowNull: true },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });

    await queryInterface.addConstraint('approval_requests', {
      fields: ['flowId'],
      type: 'foreign key',
      name: 'fk_approval_requests_flowId',
      references: { table: 'approval_flows', field: 'id' },
      onUpdate: 'NO ACTION',
      onDelete: 'NO ACTION'
    });

    await queryInterface.addIndex('approval_requests', ['docType', 'docEntry'], {
      name: 'ix_approval_requests_doc'
    });

    await queryInterface.addIndex('approval_requests', ['companyId', 'status'], {
      name: 'ix_approval_requests_company_status'
    });

    await queryInterface.createTable('approval_request_actions', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      requestId: { type: Sequelize.INTEGER, allowNull: false },
      stageOrder: { type: Sequelize.INTEGER, allowNull: false },
      approverUserId: { type: Sequelize.INTEGER, allowNull: true },
      decision: { type: Sequelize.STRING, allowNull: false },
      remark: { type: Sequelize.TEXT, allowNull: true },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });

    await queryInterface.addConstraint('approval_request_actions', {
      fields: ['requestId'],
      type: 'foreign key',
      name: 'fk_approval_request_actions_requestId',
      references: { table: 'approval_requests', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('approval_request_actions');
    await queryInterface.dropTable('approval_requests');
    await queryInterface.dropTable('approval_flow_stage_approvers');
    await queryInterface.dropTable('approval_flow_stages');
    await queryInterface.dropTable('approval_flows');
  }
};
