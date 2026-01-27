'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sap_sessions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: { type: Sequelize.INTEGER, allowNull: false, unique: true },
      sap_username: { type: Sequelize.STRING, allowNull: false },
      company_db: { type: Sequelize.STRING, allowNull: false },
      b1_session: { type: Sequelize.STRING, allowNull: false },
      base_url: { type: Sequelize.STRING, allowNull: false },
      route_id: { type: Sequelize.STRING, allowNull: false },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      expires_at: { type: Sequelize.DATE },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sap_sessions');
  }
};