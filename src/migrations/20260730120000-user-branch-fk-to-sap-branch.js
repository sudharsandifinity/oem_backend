'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query('DELETE FROM user_branches;');
    await queryInterface.sequelize.query(`
      DECLARE @fk NVARCHAR(200);
      SELECT @fk = fk.name
      FROM sys.foreign_keys fk
      JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
      JOIN sys.columns c ON fkc.parent_object_id = c.object_id AND fkc.parent_column_id = c.column_id
      WHERE fk.parent_object_id = OBJECT_ID('user_branches') AND c.name = 'branchId';
      IF @fk IS NOT NULL EXEC('ALTER TABLE user_branches DROP CONSTRAINT ' + @fk);
    `);
    await queryInterface.addConstraint('user_branches', {
      fields: ['branchId'],
      type: 'foreign key',
      name: 'fk_user_branches_sap_branch',
      references: { table: 'sap_branches', field: 'id' },
      onUpdate: 'NO ACTION',
      onDelete: 'NO ACTION'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('user_branches', 'fk_user_branches_sap_branch');
    await queryInterface.addConstraint('user_branches', {
      fields: ['branchId'],
      type: 'foreign key',
      name: 'fk_user_branches_branch',
      references: { table: 'branches', field: 'id' },
      onUpdate: 'NO ACTION',
      onDelete: 'NO ACTION'
    });
  }
};
