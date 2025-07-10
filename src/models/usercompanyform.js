'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserCompanyForm extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserCompanyForm.belongsTo(models.CompanyFormField);
      UserCompanyForm.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  UserCompanyForm.init({
    companyFormFieldId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    is_visible: DataTypes.TINYINT,
    status: DataTypes.TINYINT,
  }, {
    sequelize,
    modelName: 'UserCompanyForm',
    tableName: 'user_company_forms'
  });
  return UserCompanyForm;
};