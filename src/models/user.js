const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');

class User extends Model {
    // Instance method (optional for later verification)
    async comparePassword(plainPassword) {
        return await bcrypt.compare(plainPassword, this.password);
    }

    static associate(models) {
        // User.belongsTo(models.Role);
        User.belongsToMany(models.Branch, {
            through: models.UserBranch,
            foreignKey: 'userId',
            otherKey: 'branchId'
        });
        User.belongsToMany(models.Role, {
            through: models.UserRole,
            foreignKey: 'userId',
            otherKey: 'roleId'
        });
    }
}

module.exports = (sequelize) => {
    User.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        is_sap_user: {type: DataTypes.TINYINT},
        sap_emp_id: {type: DataTypes.STRING},
        department: {type: DataTypes.STRING},
        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        is_super_user: {
            type: DataTypes.TINYINT,
            defaultValue: 0
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.TINYINT,
            defaultValue: 1
        }
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: true,
        hooks: {
            beforeCreate: async (user) => {
                if (user.password) {
                    user.password = await bcrypt.hash(user.password, 10);
                }
            },
            beforeUpdate: async (user) => {
                if (user.changed('password')) {
                    user.password = await bcrypt.hash(user.password, 10);
                }
            }
        }
    });

    return User;
};
