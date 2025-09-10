'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('role_permissions', [
      {
        roleId: 2,
        permissionId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2,
        permissionId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2,
        permissionId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2,
        permissionId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2,
        permissionId: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2,
        permissionId: 12,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2,
        permissionId: 13,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2,
        permissionId: 14,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2,
        permissionId: 15,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2,
        permissionId: 16,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2,
        permissionId: 17,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2,
        permissionId: 18,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2,
        permissionId: 19,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2,
        permissionId: 20,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2,
        permissionId: 21,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2,
        permissionId: 22,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2,
        permissionId: 23,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2,
        permissionId: 24,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2,
        permissionId: 32,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2,
        permissionId: 33,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2,
        permissionId: 34,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2,
        permissionId: 37,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 3,
        permissionId: 12,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 3,
        permissionId: 13,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 3,
        permissionId: 14,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 3,
        permissionId: 15,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 3,
        permissionId: 16,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 3,
        permissionId: 17,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 3,
        permissionId: 18,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 3,
        permissionId: 19,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 3,
        permissionId: 20,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 3,
        permissionId: 21,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 4,
        permissionId: 22,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 4,
        permissionId: 23,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 4,
        permissionId: 24,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 4,
        permissionId: 25,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('role_permissions', {
      roleId: 2
    }, {});
  }
};
