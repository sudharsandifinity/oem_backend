'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      {
        name: 'admin',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'sub-admin',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'manager',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'supervisor',
        status: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', {
      name: { [Sequelize.Op.in]: ['admin', 'sub-admin', 'manager', 'supervisor'] }
    }, {});
  }
};