'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('companies', [
      {
        name: 'Difinity',
        company_code: 'A123',
        company_db_name: 'test1',
        // city: 'Kerala',
        // address: '123 Church St.',
        // is_branch: 0,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Colan',
        company_code: 'B123',
        company_db_name: 'test2',
        // city: 'Chennai',
        // address: 'Greams Road',
        // is_branch: 0,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'ABC',
        company_code: 'C123',
        company_db_name: 'test3',
        // city: 'Bangalore',
        // address: 'Gandhi Road',
        // is_branch: 0,
        status: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('companies', null, {});
  }
};
