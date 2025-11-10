'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SAPSession extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SAPSession.init({
    user_id: { 
      type: DataTypes.INTEGER,
      unique: true
    },
    sap_username: DataTypes.STRING,
    company_db: DataTypes.STRING,
    b1_session: DataTypes.STRING,
    route_id: DataTypes.STRING,
    expires_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'SAPSession',
    tableName: 'sap_sessions'
  });
  return SAPSession;
};