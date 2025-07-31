'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_menu_permissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userMenuId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'user_menus',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      can_list_view: {
        type: Sequelize.TINYINT,
        defaultValue: 0,
        comment: '0-false, 1-true'
      },
      can_create: {
        type: Sequelize.TINYINT,
        defaultValue: 0,
        comment: '0-false, 1-true'
      },
      can_edit: {
        type: Sequelize.TINYINT,
        defaultValue: 0,
        comment: '0-false, 1-true'
      },
      can_view: {
        type: Sequelize.TINYINT,
        defaultValue: 0,
        comment: '0-false, 1-true'
      },
      can_delete: {
        type: Sequelize.TINYINT,
        defaultValue: 0,
        comment: '0-false, 1-true'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_menu_permissions');
  }
};