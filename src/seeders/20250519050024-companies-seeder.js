'use strict';

const { encrypt } = require('../utils/crypto');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('companies', [
      {
        name: 'Difinity',
        company_code: 'A123',
        company_db_name: 'difinity_db',
        base_url: 'difinitydigital.com',
        sap_username: encrypt('difinity'),
        secret_key: encrypt('78pijyhg12534'),
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Colan',
        company_code: 'B123',
        company_db_name: 'colan_db',
        base_url: 'colan.com',
        sap_username: encrypt('colan'),
        secret_key: encrypt('plM&34685963Mnb)'),
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'HLB',
        company_code: 'C123',
        company_db_name: 'hlb_db',
        base_url: 'hlb.com',
        sap_username: encrypt('hlb'),
        secret_key: encrypt('0lo8^585Nserss'),
        status: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('companies', null, {});
  }
};
