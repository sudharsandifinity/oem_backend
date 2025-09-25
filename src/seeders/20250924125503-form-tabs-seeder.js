'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const tabs = [
      'General',
      'Contents',
      'Logistics',
      'Accounting',
      'Attachments',
      'User-defined-field'
    ].map(name => ({
      formId: 1,
      name: name.toLowerCase().replace(/ /g, '-'),
      display_name: name,
      status: 1,
      createdAt: now,
      updatedAt: now
    }));

    await queryInterface.bulkInsert('form_tabs', tabs, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('form_tabs', { form_id: 1 }, {});
  }
};
