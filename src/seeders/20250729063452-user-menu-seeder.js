'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('user_menus', [
      {
        name: 'Sales',
        display_name: 'Sales',
        parent: null,
        order_number: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Purchase',
        display_name: 'Purchase',
        parent: null,
        order_number: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Inventory',
        display_name: 'Inventory',
        parent: null,
        order_number: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Accounts',
        display_name: 'Accounts',
        parent: null,
        order_number: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'HR',
        display_name: 'Human Resources',
        parent: null,
        order_number: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sales Order',
        display_name: 'Sales Order',
        parent: "1",
        order_number: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sales Invoice',
        display_name: 'Sales Invoice',
        parent: '1',
        order_number: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Purchase Order',
        display_name: 'Purchase Order',
        parent: '2',
        order_number: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Purchase Invoice',
        display_name: 'Purchase Invoice',
        parent: '2',
        order_number: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Stock Entry',
        display_name: 'Stock Entry',
        parent: '3',
        order_number: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Stock Report',
        display_name: 'Stock Report',
        parent: '3',
        order_number: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Payments',
        display_name: 'Payments',
        parent: '4',
        order_number: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Receipts',
        display_name: 'Receipts',
        parent: '4',
        order_number: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        name: 'Employee Master',
        display_name: 'Employee Master',
        parent: '5',
        order_number: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Leave Management',
        display_name: 'Leave Management',
        parent: '5',
        order_number: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }

    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_menus', null, {});
  }
};
