'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const formSamples = {
      1: {
        first_name: 'Alice',
        last_name: 'Johnson',
        email: 'alice.johnson@example.com',
        phone: '123-456-7890'
      },
      2: {
        company_name: 'TechNova Inc.',
        industry: 'Software',
        founded: 2010,
        employees: 150
      },
      3: {
        contact_person: 'Mark Spencer',
        contact_email: 'mark.spencer@corp.com',
        region: 'North America',
        priority: 'High'
      },
      4: {
        feedback: 'Excellent service.',
        rating: 5,
        would_recommend: true
      }
    };

    const dummyData = [];

    for (let i = 0; i < 20; i++) {
      const companyFormId = (i % 4) + 1;
      dummyData.push({
        companyFormId,
        form_data: JSON.stringify(formSamples[companyFormId]),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await queryInterface.bulkInsert('company_form_datas', dummyData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('company_form_datas', null, {});
  }
};
