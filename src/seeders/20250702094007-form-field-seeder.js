'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('form_fields', [
      {
        formId: 1,
        formSectionId: 1,
        field_name: 'search',
        display_name: 'Search',
        input_type: 'text',
        display_position: 'left',
        field_order: '1',
        is_visible: 1,
        is_field_data_bind: 0,
        bind_data_by: 'dropdown',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        formId: 1,
        formSectionId: 1,
        field_name: 'document_no',
        display_name: 'Document No',
        input_type: 'text',
        display_position: 'left',
        field_order: '2',
        is_visible: 1,
        is_field_data_bind: 0,
        bind_data_by: 'dropdown',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        formId: 1,
        formSectionId: 1,
        field_name: 'customer_code',
        display_name: 'Customer Code',
        input_type: 'text',
        display_position: 'left',
        field_order: '3',
        is_visible: 1,
        is_field_data_bind: 0,
        bind_data_by: null,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        formId: 1,
        formSectionId: 1,
        field_name: 'customer_ref_no',
        display_name: 'Customer Ref No',
        input_type: 'text',
        display_position: 'left',
        field_order: '4',
        is_visible: 1,
        is_field_data_bind: 0,
        bind_data_by: null,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        formId: 1,
        formSectionId: 1,
        field_name: 'posting_data',
        display_name: 'Posting Data',
        input_type: 'date',
        display_position: 'left',
        field_order: '5',
        is_visible: 1,
        is_field_data_bind: 0,
        bind_data_by: null,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        formId: 1,
        formSectionId: 1,
        field_name: 'delivery_data',
        display_name: 'Delivery Data',
        input_type: 'date',
        display_position: 'left',
        field_order: '6',
        is_visible: 1,
        is_field_data_bind: 0,
        bind_data_by: null,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        formId: 1,
        formSectionId: 1,
        field_name: 'status',
        display_name: 'Status',
        input_type: 'dropdown',
        display_position: 'left',
        field_order: '7',
        is_visible: 1,
        is_field_data_bind: 0,
        bind_data_by: null,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('form_fields', null, {});
  }
};
