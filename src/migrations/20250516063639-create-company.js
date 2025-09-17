'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('companies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      },
      company_code: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      },
      company_db_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      base_url: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      sap_username: {
        type: Sequelize.STRING,
        allowNull: true
      },
      secret_key: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.TINYINT,
        comment: "0-inactive 1-active",
        defaultValue: 0
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
    await queryInterface.dropTable('companies');
  }
};