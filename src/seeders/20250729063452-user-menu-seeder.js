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
      }

    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_menus', null, {});
  }
};
