'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'reset_otp_hash', { type: Sequelize.STRING(128), allowNull: true });
    await queryInterface.addColumn('users', 'reset_otp_expires_at', { type: Sequelize.DATE, allowNull: true });
    await queryInterface.addColumn('users', 'reset_otp_attempts', { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 });
    await queryInterface.addColumn('users', 'reset_otp_sent_at', { type: Sequelize.DATE, allowNull: true });
    await queryInterface.addColumn('users', 'reset_otp_request_count', { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 });
    await queryInterface.addColumn('users', 'reset_otp_window_start', { type: Sequelize.DATE, allowNull: true });
    await queryInterface.addColumn('users', 'reset_session_id', { type: Sequelize.STRING(64), allowNull: true });
  },

  async down (queryInterface) {
    await queryInterface.removeColumn('users', 'reset_session_id');
    await queryInterface.removeColumn('users', 'reset_otp_window_start');
    await queryInterface.removeColumn('users', 'reset_otp_request_count');
    await queryInterface.removeColumn('users', 'reset_otp_sent_at');
    await queryInterface.removeColumn('users', 'reset_otp_attempts');
    await queryInterface.removeColumn('users', 'reset_otp_expires_at');
    await queryInterface.removeColumn('users', 'reset_otp_hash');
  }
};
