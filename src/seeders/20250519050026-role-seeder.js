'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      {
        name: 'admin',
        scope: 'master',
        companyId: null,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'sub-admin',
        scope: 'master',
        companyId: null,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'manager',
        scope: 'master',
        companyId: null,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'gen-manager',
        scope: 'master',
        companyId: null,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'manager',
        scope: 'user',
        companyId: 1,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'supervisor',
        scope: 'user',
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