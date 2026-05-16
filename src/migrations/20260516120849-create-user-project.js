'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_projects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      projectId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addConstraint('user_projects', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_user_projects_userId',
      references: {
        table: 'users',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    await queryInterface.addConstraint('user_projects', {
      fields: ['projectId'],
      type: 'foreign key',
      name: 'fk_user_projects_projectId',
      references: {
        table: 'projects',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      'user_projects',
      'fk_user_projects_userId'
    );

    await queryInterface.removeConstraint(
      'user_projects',
      'fk_user_projects_projectId'
    );

    await queryInterface.dropTable('user_projects');
  },
};