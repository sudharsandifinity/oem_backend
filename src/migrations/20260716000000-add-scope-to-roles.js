'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('roles', 'scope', {
      type: Sequelize.ENUM('master', 'user'),
      allowNull: false,
      defaultValue: 'user',
      after: 'name'
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DECLARE @constraint NVARCHAR(200);
      SELECT @constraint = cc.name
      FROM sys.check_constraints cc
      INNER JOIN sys.columns c
        ON cc.parent_object_id = c.object_id
        AND cc.parent_column_id = c.column_id
      WHERE OBJECT_NAME(cc.parent_object_id) = 'roles'
        AND c.name = 'scope';
      IF @constraint IS NOT NULL
        EXEC('ALTER TABLE roles DROP CONSTRAINT ' + @constraint);
    `);
    await queryInterface.removeColumn('roles', 'scope');
  }
};
