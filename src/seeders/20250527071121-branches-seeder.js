'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('branches', [
      {
        companyId: 1,
        branch_code: 'X001',
        name: 'Difinity Kerala',
        city: 'Kerala',
        address: '123 Church St.',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        companyId: 1,
        branch_code: 'X002',
        name: 'Difinity Chennai',
        city: 'Chennai',
        address: 'Greams Road',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        companyId: 1,
        branch_code: 'X003',
        name: 'Difinity Coimbatore',
        city: 'Coimbatore',
        address: 'Avinashi Road',
        status: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        companyId: 2,
        branch_code: 'Y001',
        name: 'Colan Bangalore',
        city: 'Bangalore',
        address: 'Indiranagar',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        companyId: 2,
        branch_code: 'Y002',
        name: 'Colan Mumbai',
        city: 'Mumbai',
        address: 'Andheri East',
        status: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        companyId: 2,
        branch_code: 'Y003',
        name: 'Colan Delhi',
        city: 'Delhi',
        address: 'Connaught Place',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        companyId: 3,
        branch_code: 'Z001',
        name: 'ABC Hyderabad',
        city: 'Hyderabad',
        address: 'HiTech City',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        companyId: 3,
        branch_code: 'Z002',
        name: 'ABC Kochi',
        city: 'Kochi',
        address: 'MG Road',
        status: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        companyId: 3,
        branch_code: 'Z003',
        name: 'ABC Trivandrum',
        city: 'Trivandrum',
        address: 'Technopark',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        companyId: 3,
        branch_code: 'Z004',
        name: 'ABC Pune',
        city: 'Pune',
        address: 'FC Road',
        status: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('branches', null, {});
  }
};