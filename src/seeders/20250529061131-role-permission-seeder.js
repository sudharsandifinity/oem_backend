'use strict';
const { Permission, Role } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    try{
      const admin = await Role.findOne({where: {name:'admin'}});
      if(!admin) throw new Error('Admin role not found!');

      const allPermissions = await Permission.findAll();

      const rolePermissions = allPermissions.map((permission) => ({
        roleId: admin.id,
        permissionId:permission.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      await queryInterface.bulkInsert('role_permissions', rolePermissions, {});
    }catch(error){
      console.error('error seeding role permissions', error);
    }

  },

  async down (queryInterface, Sequelize) {
    try {
      const admin = await Role.findOne({ where: { name: 'admin' } });

      if (admin) {
        await queryInterface.bulkDelete('role_permissions', { roleId: admin.id }, {});
      }
    } catch (error) {
      console.error('Error in removing Admin permissions:', error);
    }
  }
};
