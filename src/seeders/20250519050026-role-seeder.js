'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      {
        name: 'admin',
        scope: 'global',
        companyId: null,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'sub-admin',
        scope: 'global',
        companyId: null,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'manager',
        scope: 'company',
        companyId: 1,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'supervisor',
        scope: 'company',
        companyId: 3,
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