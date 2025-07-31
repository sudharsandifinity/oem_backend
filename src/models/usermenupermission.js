'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserMenuPermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserMenuPermission.belongsTo(models.UserMenu, {
        foreignKey: 'userMenuId',
        as: 'menu'
      });
    }
  }
  UserMenuPermission.init({
    userMenuId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    can_list_view: {
      type: DataTypes.TINYINT,
      defaultValue: 0
    },
    can_create: {
      type: DataTypes.TINYINT,
      defaultValue: 0
    },
    can_edit: {
      type: DataTypes.TINYINT,
      defaultValue: 0
    },
    can_view: {
      type: DataTypes.TINYINT,
      defaultValue: 0
    },
    can_delete: {
      type: DataTypes.TINYINT,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'UserMenuPermission',
    tableName: 'user_menu_permissions'
  });
  return UserMenuPermission;
};