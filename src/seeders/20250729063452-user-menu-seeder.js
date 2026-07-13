'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('user_menus', [
      {
        name: 'Sales',
        display_name: 'Sales',
        companyId: null,
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
        companyId: null,
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
        companyId: null,
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
        companyId: null,
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
        companyId: null,
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
        companyId: null,
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
        companyId: null,
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
        companyId: null,
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
        companyId: null,
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
        companyId: null,
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
        companyId: null,
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
        companyId: null,
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
