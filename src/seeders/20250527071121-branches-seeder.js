'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('branches', [
      {
        companyId: 1,
        branch_code: 'X001',
        is_main: 1,
        name: 'Difinity Kerala',
        city: 'Kerala',
        address: '123 Church St.',
        country: 'India',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        companyId: 1,
        branch_code: 'X002',
        is_main: 0,
        name: 'Difinity Chennai',
        city: 'Chennai',
        address: 'Greams Road',
        country: 'India',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        companyId: 1,
        branch_code: 'X003',
        is_main: 0,
        name: 'Difinity Coimbatore',
        city: 'Coimbatore',
        address: 'Avinashi Road',
        country: 'India',
        status: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        companyId: 2,
        branch_code: 'Y001',
        is_main: 1,
        name: 'Colan Bangalore',
        city: 'Bangalore',
        address: 'Indiranagar',
        country: 'India',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        companyId: 2,
        branch_code: 'Y002',
        is_main: 0,
        name: 'Colan Mumbai',
        city: 'Mumbai',
        address: 'Andheri East',
        country: 'India',
        status: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        companyId: 2,
        branch_code: 'Y003',
        is_main: 0,
        name: 'Colan Delhi',
        city: 'Delhi',
        address: 'Connaught Place',
        country: 'India',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        companyId: 3,
        branch_code: 'Z001',
        is_main: 0,
        name: 'ABC Hyderabad',
        city: 'Hyderabad',
        address: 'HiTech City',
        country: 'India',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        companyId: 3,
        branch_code: 'Z002',
        is_main: 0,
        name: 'ABC Kochi',
        city: 'Kochi',
        address: 'MG Road',
        country: 'India',
        status: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        companyId: 3,
        branch_code: 'Z003',
        is_main: 0,
        name: 'ABC Trivandrum',
        city: 'Trivandrum',
        address: 'Technopark',
        country: 'India',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        companyId: 3,
        branch_code: 'Z004',
        is_main: 1,
        name: 'ABC Pune',
        city: 'Pune',
        address: 'FC Road',
        country: 'India',
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