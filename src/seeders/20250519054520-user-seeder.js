'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        first_name: 'Sudharsan',
        last_name: 'Admin',
        email: 'sudharsan181199@yopmail.com',
        password: await bcrypt.hash('Admin@123', 10),
        roleId: 1,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        first_name: 'SubAdmin',
        last_name: '',
        email: 'subadmindifinity@yopmail.com',
        password: await bcrypt.hash('Subadmin@123', 10),
        roleId: 2,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        first_name: 'Manger',
        last_name: 'id',
        email: 'managerdifinity@yopmail.com',
        password: await bcrypt.hash('Manger@123', 10),
        roleId: 3,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        first_name: 'Supervisor',
        last_name: 'me',
        email: 'superdifinity@yopmail.com',
        password: await bcrypt.hash('Super@123', 10),
        roleId: 3,
        status: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        first_name: 'User',
        last_name: 'id',
        email: 'userdifinity@yopmail.com',
        password: await bcrypt.hash('User@123', 10),
        roleId: 3,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};