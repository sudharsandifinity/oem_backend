'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('projects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Code: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },

      Name: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      ValidFrom: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      ValidTo: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      Active: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'tYES / tNO',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('projects');
  }
};