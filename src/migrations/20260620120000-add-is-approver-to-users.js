'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'is_approver', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      after: 'is_com_admin'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'is_approver');
  }
};
