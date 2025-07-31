'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const permissions = [];

    for (let i = 0; i < 30; i++) {
      const menuId = (i % 6) + 1; // Cycles through 1 to 6
      permissions.push({
        userMenuId: menuId,
        can_list_view: Math.round(Math.random()),
        can_create: Math.round(Math.random()),
        can_edit: Math.round(Math.random()),
        can_view: Math.round(Math.random()),
        can_delete: Math.round(Math.random()),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await queryInterface.bulkInsert('user_menu_permissions', permissions, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_menu_permissions', null, {});
  }
};
