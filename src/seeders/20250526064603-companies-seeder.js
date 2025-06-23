'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   
    await queryInterface.bulkInsert('companies', [{
        name: 'Difinity',
        city: 'Kerala',
        address: '123 church St.',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Colan',
        city: 'chennai',
        address: 'greams road',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'ABC',
        city: 'Banglore',
        address: 'Gandhi road',
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
