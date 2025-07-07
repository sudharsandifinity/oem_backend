'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('company_form_fields', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      companyId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'companies',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      formId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'forms',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      formSectionId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'form_sections',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      field_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      display_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      input_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      field_order: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_visible: {
        type: Sequelize.TINYINT,
        allowNull: true,
        defaultValue: 1
      },
      is_field_data_bind: {
        type: Sequelize.TINYINT,
        allowNull: true,
        defaultValue: 0
      },
      bind_data_by: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('company_form_fields');
  }
};
