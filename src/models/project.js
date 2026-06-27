'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Project.belongsTo(models.Company, { foreignKey: 'companyId' });
    }
  }
  Project.init({
    Code: {
      type: DataTypes.STRING,
    },
    Name: DataTypes.STRING,
    ValidFrom: DataTypes.STRING,
    ValidTo: DataTypes.STRING,
    Active: DataTypes.STRING,
    companyId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Project',
    tableName: 'projects',
    timestamps: true
  });
  return Project;
};