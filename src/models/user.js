const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');

class User extends Model {
    // Instance method (optional for later verification)
    async comparePassword(plainPassword) {
        return await bcrypt.compare(plainPassword, this.password);
    }

    toJSON() {
        const values = { ...this.get() };
        delete values.reset_otp_hash;
        delete values.reset_otp_expires_at;
        delete values.reset_otp_attempts;
        delete values.reset_otp_sent_at;
        delete values.reset_otp_request_count;
        delete values.reset_otp_window_start;
        delete values.reset_session_id;
        return values;
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

        User.hasMany(models.DeviceToken);
        User.hasMany(models.Notification);
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
        is_com_admin: {type: DataTypes.BOOLEAN},
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
        mobile: {type: DataTypes.STRING},
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
        },
        reset_otp_hash: {type: DataTypes.STRING(128)},
        reset_otp_expires_at: {type: DataTypes.DATE},
        reset_otp_attempts: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        reset_otp_sent_at: {type: DataTypes.DATE},
        reset_otp_request_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        reset_otp_window_start: {type: DataTypes.DATE},
        reset_session_id: {type: DataTypes.STRING(64)}
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
