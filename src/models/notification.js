'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Notification.belongsTo(models.User, {foreignKey:'userId'});
    }
  }
  Notification.init({
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    body: DataTypes.STRING,
    type: DataTypes.STRING,
    referenceId: DataTypes.STRING,
    url: DataTypes.STRING,
    application_status: DataTypes.STRING,
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, {
    sequelize,
    modelName: 'Notification',
    tableName: 'notifications'
  });
  return Notification;
};