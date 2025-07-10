'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const records = [
      { userId: 2, companyFormFieldId: 1, is_visible: 1, status: 1, createdAt: now, updatedAt: now },
      { userId: 2, companyFormFieldId: 2, is_visible: 1, status: 1, createdAt: now, updatedAt: now },
      { userId: 2, companyFormFieldId: 3, is_visible: 1, status: 1, createdAt: now, updatedAt: now },
      { userId: 2, companyFormFieldId: 4, is_visible: 1, status: 1, createdAt: now, updatedAt: now },
      { userId: 2, companyFormFieldId: 5, is_visible: 1, status: 1, createdAt: now, updatedAt: now },
      { userId: 2, companyFormFieldId: 6, is_visible: 1, status: 1, createdAt: now, updatedAt: now },
      { userId: 3, companyFormFieldId: 2, is_visible: 1, status: 1, createdAt: now, updatedAt: now },
      { userId: 3, companyFormFieldId: 3, is_visible: 1, status: 1, createdAt: now, updatedAt: now },
      { userId: 3, companyFormFieldId: 7, is_visible: 1, status: 1, createdAt: now, updatedAt: now },
      { userId: 3, companyFormFieldId: 8, is_visible: 1, status: 1, createdAt: now, updatedAt: now },
      { userId: 3, companyFormFieldId: 9, is_visible: 1, status: 1, createdAt: now, updatedAt: now },
      { userId: 3, companyFormFieldId: 10, is_visible: 1, status: 1, createdAt: now, updatedAt: now },
      { userId: 3, companyFormFieldId: 11, is_visible: 1, status: 1, createdAt: now, updatedAt: now },
      { userId: 4, companyFormFieldId: 5, is_visible: 1, status: 1, createdAt: now, updatedAt: now },
      { userId: 4, companyFormFieldId: 6, is_visible: 1, status: 1, createdAt: now, updatedAt: now },
      { userId: 4, companyFormFieldId: 9, is_visible: 1, status: 1, createdAt: now, updatedAt: now },
      { userId: 4, companyFormFieldId: 12, is_visible: 1, status: 1, createdAt: now, updatedAt: now },
      { userId: 4, companyFormFieldId: 13, is_visible: 1, status: 1, createdAt: now, updatedAt: now },
      { userId: 4, companyFormFieldId: 14, is_visible: 1, status: 1, createdAt: now, updatedAt: now },
      { userId: 5, companyFormFieldId: 1, is_visible: 1, status: 1, createdAt: now, updatedAt: now },
      { userId: 5, companyFormFieldId: 3, is_visible: 1, status: 1, createdAt: now, updatedAt: now },
      { userId: 5, companyFormFieldId: 7, is_visible: 1, status: 1, createdAt: now, updatedAt: now },
      { userId: 5, companyFormFieldId: 11, is_visible: 1, status: 1, createdAt: now, updatedAt: now },
      { userId: 5, companyFormFieldId: 13, is_visible: 1, status: 1, createdAt: now, updatedAt: now },
      { userId: 5, companyFormFieldId: 14, is_visible: 1, status: 1, createdAt: now, updatedAt: now },
      { userId: 5, companyFormFieldId: 15, is_visible: 1, status: 1, createdAt: now, updatedAt: now },
    ];

    await queryInterface.bulkInsert('user_company_forms', records, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_company_forms', null, {});
  }
};
