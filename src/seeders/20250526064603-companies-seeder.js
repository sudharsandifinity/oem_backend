'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   
    await queryInterface.bulkInsert('companies', [{
        name: 'Difinity',
        company_code: 'A123',
        company_db_name: 'test1',
        city: 'Kerala',
        address: '123 church St.',
        is_branch: 1,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Colan',
        company_code: 'B123',
        company_db_name: 'test2',
        city: 'chennai',
        address: 'greams road',
        is_branch: 1,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'ABC',
        company_code: 'C123',
        company_db_name: 'test3',
        city: 'Banglore',
        address: 'Gandhi road',
        is_branch: 1,
        status: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.bulkDelete('companies', null, {});
  }
};
