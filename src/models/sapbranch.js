'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SapBranch extends Model {
    static associate(models) {
      // define associations here if needed
    }
  }

  SapBranch.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    companyId: DataTypes.INTEGER,
    BPLID: DataTypes.INTEGER,
    BPLName: DataTypes.STRING,
    BPLNameForeign: DataTypes.STRING,
    VATRegNum: DataTypes.STRING,
    RepName: DataTypes.STRING,
    Industry: DataTypes.STRING,
    Business: DataTypes.STRING,
    Address: DataTypes.TEXT,
    Addressforeign: DataTypes.STRING,
    MainBPL: DataTypes.STRING,
    TaxOfficeNo: DataTypes.STRING,
    Disabled: DataTypes.STRING,
    DefaultCustomerID: DataTypes.STRING,
    DefaultVendorID: DataTypes.STRING,
    DefaultWarehouseID: DataTypes.STRING,
    DefaultTaxCode: DataTypes.STRING,
    TaxOffice: DataTypes.STRING,
    FederalTaxID: DataTypes.STRING,
    FederalTaxID2: DataTypes.STRING,
    FederalTaxID3: DataTypes.STRING,
    AdditionalIdNumber: DataTypes.STRING,
    NatureOfCompanyCode: DataTypes.INTEGER,
    EconomicActivityTypeCode: DataTypes.INTEGER,
    CreditContributionOriginCode: DataTypes.STRING,
    IPIPeriodCode: DataTypes.STRING,
    CooperativeAssociationTypeCode: DataTypes.INTEGER,
    ProfitTaxationCode: DataTypes.INTEGER,
    CompanyQualificationCode: DataTypes.INTEGER,
    DeclarerTypeCode: DataTypes.INTEGER,
    PreferredStateCode: DataTypes.STRING,
    AddressType: DataTypes.STRING,
    Street: DataTypes.STRING,
    StreetNo: DataTypes.STRING,
    Building: DataTypes.STRING,
    ZipCode: DataTypes.STRING,
    Block: DataTypes.STRING,
    City: DataTypes.STRING,
    State: DataTypes.STRING,
    County: DataTypes.STRING,
    Country: DataTypes.STRING,
    AliasName: DataTypes.STRING,
    CommercialRegister: DataTypes.STRING,
    DateOfIncorporation: DataTypes.DATE,
    SPEDProfile: DataTypes.STRING,
    EnvironmentType: DataTypes.INTEGER,
    Opting4ICMS: DataTypes.STRING,
    PaymentClearingAccount: DataTypes.STRING,
    GlobalLocationNumber: DataTypes.STRING,
    DefaultResourceWarehouseID: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'SapBranch',
    tableName: 'sap_branches',
    timestamps: true
  });

  return SapBranch;
};