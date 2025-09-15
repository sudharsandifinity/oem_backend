'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('user_roles', [
      {
        userId: 1,
        roleId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        roleId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 3,
        roleId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 4,
        roleId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 4,
        roleId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 5,
        roleId: 9,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 7,
        roleId: 7,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 8,
        roleId: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 9,
        roleId: 8,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_roles', null, {});
  }
};
