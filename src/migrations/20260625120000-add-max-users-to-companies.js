'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('companies', 'max_users', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 20,
      after: 'status'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('companies', 'max_users');
  }
};
