'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('role_menus', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      roleId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'roles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      userMenuId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'user_menus',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      can_list_view: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      can_create: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      can_edit: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      can_view: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      can_delete: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
    await queryInterface.dropTable('role_menus');
  }
};
