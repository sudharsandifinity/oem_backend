'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const now = new Date();

    await queryInterface.bulkInsert('forms', [
      { name: 'so', display_name: 'Sales Order', form_type: 'item', scope: 'global', status: 1, parentFormId: null, companyId: null, branchId: null, createdAt: now, updatedAt: now },
      { name: 'po', display_name: 'Purchase Order', form_type: 'service', scope: 'global', status: 1, parentFormId: null, companyId: null, branchId: null, createdAt: now, updatedAt: now },
      { name: 'test', display_name: 'Test Form', form_type: 'item', scope: 'global', status: 0, parentFormId: null, companyId: null, branchId: null, createdAt: now, updatedAt: now },

      { name: 'so_c1', display_name: 'Sales Order C1', form_type: 'item', scope: 'company', status: 1, parentFormId: null, companyId: 1, branchId: null, createdAt: now, updatedAt: now },
      { name: 'po_c1', display_name: 'Purchase Order C1', form_type: 'service', scope: 'company', status: 1, parentFormId: null, companyId: 1, branchId: null, createdAt: now, updatedAt: now },
      { name: 'test_c1', display_name: 'Test Form C1', form_type: 'item', scope: 'company', status: 0, parentFormId: null, companyId: 1, branchId: null, createdAt: now, updatedAt: now },

      { name: 'so_c2', display_name: 'Sales Order C2', form_type: 'item', scope: 'company', status: 1, parentFormId: null, companyId: 2, branchId: null, createdAt: now, updatedAt: now },
      { name: 'po_c2', display_name: 'Purchase Order C2', form_type: 'service', scope: 'company', status: 1, parentFormId: null, companyId: 2, branchId: null, createdAt: now, updatedAt: now },
      { name: 'test_c2', display_name: 'Test Form C2', form_type: 'item', scope: 'company', status: 0, parentFormId: null, companyId: 2, branchId: null, createdAt: now, updatedAt: now },

      { name: 'so_c3', display_name: 'Sales Order C3', form_type: 'item', scope: 'company', status: 1, parentFormId: null, companyId: 3, branchId: null, createdAt: now, updatedAt: now },
      { name: 'po_c3', display_name: 'Purchase Order C3', form_type: 'service', scope: 'company', status: 1, parentFormId: null, companyId: 3, branchId: null, createdAt: now, updatedAt: now },
      { name: 'test_c3', display_name: 'Test Form C3', form_type: 'item', scope: 'company', status: 0, parentFormId: null, companyId: 3, branchId: null, createdAt: now, updatedAt: now },

      { name: 'so_c1b1', display_name: 'Sales Order C1B1', form_type: 'item', scope: 'branch', status: 1, parentFormId: null, companyId: null, branchId: 1, createdAt: now, updatedAt: now },
      { name: 'po_c1b1', display_name: 'Purchase Order C1B1', form_type: 'service', scope: 'branch', status: 1, parentFormId: null, companyId: null, branchId: 1, createdAt: now, updatedAt: now },
      { name: 'test_c1b1', display_name: 'Test Form C1B1', form_type: 'item', scope: 'branch', status: 0, parentFormId: null, companyId: null, branchId: 1, createdAt: now, updatedAt: now },

      { name: 'so_c2b1', display_name: 'Sales Order C2B1', form_type: 'item', scope: 'branch', status: 1, parentFormId: null, companyId: null, branchId: 4, createdAt: now, updatedAt: now },
      { name: 'po_c2b1', display_name: 'Purchase Order C2B1', form_type: 'service', scope: 'branch', status: 1, parentFormId: null, companyId: null, branchId: 4, createdAt: now, updatedAt: now },

      { name: 'so_c3b1', display_name: 'Sales Order C3B1', form_type: 'item', scope: 'branch', status: 1, parentFormId: null, companyId: null, branchId: 7, createdAt: now, updatedAt: now },
      { name: 'po_c3b1', display_name: 'Purchase Order C3B1', form_type: 'service', scope: 'branch', status: 1, parentFormId: null, companyId: null, branchId: 7, createdAt: now, updatedAt: now },
      { name: 'test_c3b1', display_name: 'Test Form C3B1', form_type: 'item', scope: 'branch', status: 0, parentFormId: null, companyId: null, branchId: 7, createdAt: now, updatedAt: now },
      
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('forms', null, {});
  }
};
