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
        is_super_user: 1,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        first_name: 'SubAdmin',
        last_name: '',
        email: 'subadmindifinity@yopmail.com',
        password: await bcrypt.hash('Subadmin@123', 10),
        is_super_user: 1,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        first_name: 'Manger',
        last_name: 'id',
        email: 'managerdifinity@yopmail.com',
        password: await bcrypt.hash('Manger@123', 10),
        is_super_user: 1,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        first_name: 'Manger2',
        last_name: 'id',
        email: 'manager2difinity@yopmail.com',
        password: await bcrypt.hash('Manger@123', 10),
        is_super_user: 1,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        first_name: 'Manger',
        last_name: 'id',
        email: 'managerdifinity1@yopmail.com',
        password: await bcrypt.hash('Manger@123', 10),
        is_super_user: 0,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        first_name: 'Supervisor',
        last_name: 'me',
        email: 'superdifinity@yopmail.com',
        password: await bcrypt.hash('Super@123', 10),
        is_super_user: 1,
        status: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        first_name: 'User',
        last_name: 'id',
        email: 'userdifinity@yopmail.com',
        password: await bcrypt.hash('User@123', 10),
        is_super_user: 0,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        first_name: 'Karthick',
        last_name: 'K',
        email: 'karthick.difinity@yopmail.com',
        password: await bcrypt.hash('User@123', 10),
        is_super_user: 0,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        first_name: 'Ajay',
        last_name: 'S',
        email: 'ajay.difinity@yopmail.com',
        password: await bcrypt.hash('User@123', 10),
        is_super_user: 0,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        first_name: 'Abi',
        last_name: 'R',
        email: 'abi.difinity@yopmail.com',
        password: await bcrypt.hash('User@123', 10),
        is_super_user: 0,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        first_name: 'Praveen',
        last_name: 'S',
        email: 'praveen.difinity@yopmail.com',
        password: await bcrypt.hash('User@123', 10),
        is_super_user: 0,
        status: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};