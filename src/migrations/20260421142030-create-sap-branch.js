'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sap_branches', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      companyId: {
        type: Sequelize.INTEGER
      },
      BPLID: {
        type: Sequelize.INTEGER
      },
      BPLName: {
        type: Sequelize.STRING
      },
      BPLNameForeign: {
        type: Sequelize.STRING
      },
      VATRegNum: {
        type: Sequelize.STRING
      },
      RepName: {
        type: Sequelize.STRING
      },
      Industry: {
        type: Sequelize.STRING
      },
      Business: {
        type: Sequelize.STRING
      },
      Address: {
        type: Sequelize.TEXT
      },
      Addressforeign: {
        type: Sequelize.STRING
      },
      MainBPL: {
        type: Sequelize.STRING
      },
      TaxOfficeNo: {
        type: Sequelize.STRING
      },
      Disabled: {
        type: Sequelize.STRING
      },
      DefaultCustomerID: {
        type: Sequelize.STRING
      },
      DefaultVendorID: {
        type: Sequelize.STRING
      },
      DefaultWarehouseID: {
        type: Sequelize.STRING
      },
      DefaultTaxCode: {
        type: Sequelize.STRING
      },
      TaxOffice: {
        type: Sequelize.STRING
      },
      FederalTaxID: {
        type: Sequelize.STRING
      },
      FederalTaxID2: {
        type: Sequelize.STRING
      },
      FederalTaxID3: {
        type: Sequelize.STRING
      },
      AdditionalIdNumber: {
        type: Sequelize.STRING
      },
      NatureOfCompanyCode: {
        type: Sequelize.INTEGER
      },
      EconomicActivityTypeCode: {
        type: Sequelize.INTEGER
      },
      CreditContributionOriginCode: {
        type: Sequelize.STRING
      },
      IPIPeriodCode: {
        type: Sequelize.STRING
      },
      CooperativeAssociationTypeCode: {
        type: Sequelize.INTEGER
      },
      ProfitTaxationCode: {
        type: Sequelize.INTEGER
      },
      CompanyQualificationCode: {
        type: Sequelize.INTEGER
      },
      DeclarerTypeCode: {
        type: Sequelize.INTEGER
      },
      PreferredStateCode: {
        type: Sequelize.STRING
      },
      AddressType: {
        type: Sequelize.STRING
      },
      Street: {
        type: Sequelize.STRING
      },
      StreetNo: {
        type: Sequelize.STRING
      },
      Building: {
        type: Sequelize.STRING
      },
      ZipCode: {
        type: Sequelize.STRING
      },
      Block: {
        type: Sequelize.STRING
      },
      City: {
        type: Sequelize.STRING
      },
      State: {
        type: Sequelize.STRING
      },
      County: {
        type: Sequelize.STRING
      },
      Country: {
        type: Sequelize.STRING
      },
      AliasName: {
        type: Sequelize.STRING
      },
      CommercialRegister: {
        type: Sequelize.STRING
      },
      DateOfIncorporation: {
        type: Sequelize.DATE
      },
      SPEDProfile: {
        type: Sequelize.STRING
      },
      EnvironmentType: {
        type: Sequelize.INTEGER
      },
      Opting4ICMS: {
        type: Sequelize.STRING
      },
      PaymentClearingAccount: {
        type: Sequelize.STRING
      },
      GlobalLocationNumber: {
        type: Sequelize.STRING
      },
      DefaultResourceWarehouseID: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('sap_branches');
  }
};