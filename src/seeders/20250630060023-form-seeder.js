'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('forms', [{
      name: 'so',
      display_name: 'sales order',
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date()
     },
     {
      name: 'po',
      display_name: 'purchase order',
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date()
     },
     {
      name: 'test',
      display_name: 'test form',
      status: 0,
      createdAt: new Date(),
      updatedAt: new Date()
     },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('forms', null, {});
  }
};
