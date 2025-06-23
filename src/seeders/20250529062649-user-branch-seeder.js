'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert('user_branches', [{
        userId: 1,
        branchId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 1,
        branchId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        branchId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        branchId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 3,
        branchId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 4,
        branchId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 4,
        branchId: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 4,
        branchId: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 5,
        branchId: 7,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 5,
        branchId: 9,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.bulkDelete('user_branches', null, {});
  }
};
