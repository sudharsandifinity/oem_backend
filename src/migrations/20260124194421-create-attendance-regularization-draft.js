'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('attendance_regularization_drafts', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },

      Code: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      U_EmpID: {
        type: Sequelize.STRING,
        allowNull: true
      },
      U_PrjCode: {
        type: Sequelize.STRING,
        allowNull: true
      },
      U_PrjName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      U_Task: {
        type: Sequelize.STRING,
        allowNull: true
      },
      U_InTime: {
        type: Sequelize.STRING,
        allowNull: true
      },
      U_OutTime: {
        type: Sequelize.STRING,
        allowNull: true
      },
      U_AttDt: {
        type: Sequelize.STRING,
        allowNull: false
      },
      U_OAttDt: {
        type: Sequelize.STRING,
        allowNull: true
      },
      U_ApprSts: {
        type: Sequelize.STRING,
        allowNull: true
      },
      U_IsReSub: {
        type: Sequelize.STRING,
        allowNull: true
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

  async down(queryInterface) {
    await queryInterface.dropTable('attendance_regularization_drafts');
  }
};
