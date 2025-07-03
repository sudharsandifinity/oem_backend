'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('form_sections', [
      {
        section_name: 'Header Left',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        section_name: 'Header Right',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        section_name: 'FooterLeft',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        section_name: 'FooterRight',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        section_name: 'Lines',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        section_name: 'LineTab',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {})
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('form_sections', null, {});
  }
};
