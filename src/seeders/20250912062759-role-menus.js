'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('role_menus', [
      {
        roleId: 5,
        userMenuId: 9,
        can_list_view: true,
        can_create: true,
        can_edit: true,
        can_view: true,
        can_delete: true,
        createdAt: now,
        updatedAt: now
      },
      {
        roleId: 5,
        userMenuId: 10,
        can_list_view: true,
        can_create: true,
        can_edit: true,
        can_view: true,
        can_delete: true,
        createdAt: now,
        updatedAt: now
      },
      {
        roleId: 7,
        userMenuId: 9,
        can_list_view: true,
        can_create: true,
        can_edit: false,
        can_view: true,
        can_delete: false,
        createdAt: now,
        updatedAt: now
      },
      {
        roleId: 7,
        userMenuId: 10,
        can_list_view: true,
        can_create: true,
        can_edit: false,
        can_view: true,
        can_delete: false,
        createdAt: now,
        updatedAt: now
      },
      {
        roleId: 6,
        userMenuId: 11,
        can_list_view: true,
        can_create: true,
        can_edit: true,
        can_view: true,
        can_delete: true,
        createdAt: now,
        updatedAt: now
      },
      {
        roleId: 6,
        userMenuId: 12,
        can_list_view: true,
        can_create: true,
        can_edit: true,
        can_view: true,
        can_delete: true,
        createdAt: now,
        updatedAt: now
      },
      {
        roleId: 8,
        userMenuId: 11,
        can_list_view: true,
        can_create: false,
        can_edit: false,
        can_view: true,
        can_delete: false,
        createdAt: now,
        updatedAt: now
      },
      {
        roleId: 8,
        userMenuId: 12,
        can_list_view: true,
        can_create: false,
        can_edit: false,
        can_view: true,
        can_delete: false,
        createdAt: now,
        updatedAt: now
      },
      {
        roleId: 9,
        userMenuId: 7,
        can_list_view: true,
        can_create: false,
        can_edit: false,
        can_view: true,
        can_delete: false,
        createdAt: now,
        updatedAt: now
      },
      {
        roleId: 9,
        userMenuId: 8,
        can_list_view: true,
        can_create: false,
        can_edit: false,
        can_view: true,
        can_delete: false,
        createdAt: now,
        updatedAt: now
      },
      {
        roleId: 9,
        userMenuId: 9,
        can_list_view: true,
        can_create: false,
        can_edit: false,
        can_view: true,
        can_delete: false,
        createdAt: now,
        updatedAt: now
      },
      {
        roleId: 9,
        userMenuId: 10,
        can_list_view: true,
        can_create: false,
        can_edit: false,
        can_view: true,
        can_delete: false,
        createdAt: now,
        updatedAt: now
      },
      {
        roleId: 9,
        userMenuId: 11,
        can_list_view: true,
        can_create: false,
        can_edit: false,
        can_view: true,
        can_delete: false,
        createdAt: now,
        updatedAt: now
      },
      {
        roleId: 9,
        userMenuId: 12,
        can_list_view: true,
        can_create: false,
        can_edit: false,
        can_view: true,
        can_delete: false,
        createdAt: now,
        updatedAt: now
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('role_menus', null, {});
  }
};
