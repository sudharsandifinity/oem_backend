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
        name: 'Sales Manager',
        scope: 'user',
        companyId: 1,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Purchasing Manager',
        scope: 'user',
        companyId: 1,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sales Representative',
        scope: 'user',
        companyId: 1,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Purchase Executive',
        scope: 'user',
        companyId: 1,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Company Manager',
        scope: 'user',
        companyId: 1,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};