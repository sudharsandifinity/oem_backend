'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const subForms = [
      {
        formTabId: 1,
        name: 'customer-details',
        display_name: 'Customer Details',
        status: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        formTabId: 1,
        name: 'document-details',
        display_name: 'Document Details',
        status: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        formTabId: 2,
        name: 'contents-list',
        display_name: 'Contents List',
        status: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        formTabId: 3,
        name: 'logistics',
        display_name: 'Logistics',
        status: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        formTabId: 4,
        name: 'accounting',
        display_name: 'Accounting',
        status: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        formTabId: 5,
        name: 'attachments',
        display_name: 'Attachments',
        status: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        formTabId: 6,
        name: 'userdefined-fields',
        display_name: 'Userdefined Fields',
        status: 1,
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert('sub_forms', subForms, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('sub_forms', null, {});
  }
};
