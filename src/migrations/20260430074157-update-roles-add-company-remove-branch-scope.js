'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

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
    await queryInterface.removeConstraint('roles', 'fk_roles_branchId');
    await queryInterface.sequelize.query(`
      DECLARE @sql NVARCHAR(MAX) = '';

      SELECT @sql += 'DROP INDEX [' + i.name + '] ON roles;'
      FROM sys.indexes i
      INNER JOIN sys.index_columns ic 
        ON i.object_id = ic.object_id AND i.index_id = ic.index_id
      INNER JOIN sys.columns c 
        ON ic.object_id = c.object_id AND ic.column_id = c.column_id
      WHERE OBJECT_NAME(i.object_id) = 'roles'
        AND c.name = 'branchId';

      SELECT @sql += 'ALTER TABLE roles DROP CONSTRAINT [' + dc.name + '];'
      FROM sys.default_constraints dc
      INNER JOIN sys.columns c 
        ON dc.parent_object_id = c.object_id
        AND dc.parent_column_id = c.column_id
      WHERE OBJECT_NAME(dc.parent_object_id) = 'roles'
        AND c.name = 'branchId';

      EXEC sp_executesql @sql;
    `);

    await queryInterface.removeColumn('roles', 'branchId');
    await queryInterface.addColumn('roles', 'companyId', {
      type: Sequelize.INTEGER,
      after: 'name',
      references: {
        model: 'companies',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }
};