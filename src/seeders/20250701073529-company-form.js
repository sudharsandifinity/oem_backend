'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('company_forms', [{
        companyId: 1,
        formId: 1,
        form_type: 'item',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        companyId: 2,
        formId: 1,
        form_type: 'item',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        companyId: 2,
        formId: 2,
        form_type: 'Service',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        companyId: 3,
        formId: 1,
        form_type: 'Service',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete('company_forms', null, {});
  }
};
