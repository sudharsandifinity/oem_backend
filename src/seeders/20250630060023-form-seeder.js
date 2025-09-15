'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const now = new Date();

    await queryInterface.bulkInsert('forms', [
      { name: 'so', display_name: 'Sales Order', form_type: 'service', scope: 'global', status: 1, parentFormId: null, companyId: null, branchId: null, createdAt: now, updatedAt: now },
      { name: 'so', display_name: 'Sales Quotation', form_type: 'service', scope: 'global', status: 1, parentFormId: null, companyId: null, branchId: null, createdAt: now, updatedAt: now },
      { name: 'po', display_name: 'Purchase Order', form_type: 'service', scope: 'global', status: 1, parentFormId: null, companyId: null, branchId: null, createdAt: now, updatedAt: now },
      { name: 'po', display_name: 'Purchase Quotation', form_type: 'service', scope: 'global', status: 1, parentFormId: null, companyId: null, branchId: null, createdAt: now, updatedAt: now },
      { name: 'test', display_name: 'Test Form', form_type: 'item', scope: 'global', status: 0, parentFormId: null, companyId: null, branchId: null, createdAt: now, updatedAt: now },

      { name: 'so', display_name: 'Sales Order', form_type: 'service', scope: 'branch', status: 1, parentFormId: null, companyId: null, branchId: 1, createdAt: now, updatedAt: now },
      { name: 'so', display_name: 'Sales Quotation', form_type: 'service', scope: 'branch', status: 1, parentFormId: null, companyId: null, branchId: 1, createdAt: now, updatedAt: now },
      { name: 'po', display_name: 'Purchase Order', form_type: 'service', scope: 'branch', status: 1, parentFormId: null, companyId: null, branchId: 1, createdAt: now, updatedAt: now },
      { name: 'po', display_name: 'Purchase Quotation', form_type: 'service', scope: 'branch', status: 1, parentFormId: null, companyId: null, branchId: 1, createdAt: now, updatedAt: now },
      
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('forms', null, {});
  }
};
