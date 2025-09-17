'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('user_menus', [
      {
        name: 'Sales',
        display_name: 'Sales',
        scope: 'global',
        companyId: null,
        branchId: null,
        parentUserMenuId: null,
        formId: null,
        order_number: 1,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Purchase',
        display_name: 'Purchase',
        scope: 'global',
        companyId: null,
        branchId: null,
        formId: null,
        parentUserMenuId: null,
        order_number: 2,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sales Order',
        display_name: 'Sales Order',
        scope: 'global',
        companyId: null,
        branchId: null,
        parentUserMenuId: 1,
        formId: 1,
        order_number: 1,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sales Quotation',
        display_name: 'Sales Quotation',
        scope: 'global',
        companyId: null,
        branchId: null,
        parentUserMenuId: 1,
        formId: 2,
        order_number: 1,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Purchase Order',
        display_name: 'Purchase Order',
        scope: 'global',
        companyId: null,
        branchId: null,
        parentUserMenuId: 2,
        formId: 3,
        order_number: 1,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Purchase Quotation',
        display_name: 'Purchase Quotation',
        scope: 'global',
        companyId: null,
        branchId: null,
        parentUserMenuId: 2,
        formId: 4,
        order_number: 2,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sales',
        display_name: 'Sales',
        scope: 'branch',
        companyId: null,
        branchId: 1,
        parentUserMenuId: null,
        formId: null,
        order_number: 1,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Purchase',
        display_name: 'Purchase',
        scope: 'branch',
        companyId: null,
        branchId: 1,
        formId: null,
        parentUserMenuId: null,
        order_number: 2,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sales Order',
        display_name: 'Sales Order',
        scope: 'branch',
        companyId: null,
        branchId: 1,
        parentUserMenuId: 7,
        formId: 1,
        order_number: 1,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sales Quotation',
        display_name: 'Sales Quotation',
        scope: 'branch',
        companyId: null,
        branchId: 1,
        parentUserMenuId: 7,
        formId: 2,
        order_number: 1,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Purchase Order',
        display_name: 'Purchase Order',
        scope: 'branch',
        companyId: null,
        branchId: 1,
        parentUserMenuId: 8,
        formId: 3,
        order_number: 1,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Purchase Quotation',
        display_name: 'Purchase Quotation',
        scope: 'branch',
        companyId: null,
        branchId: 1,
        parentUserMenuId: 8,
        formId: 4,
        order_number: 2,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_menus', null, {});
  }
};
