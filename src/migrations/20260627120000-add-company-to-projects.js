'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('projects', 'companyId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'companies', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      after: 'Active'
    });

    const [rows] = await queryInterface.sequelize.query(`
      SELECT kc.name AS constraintName
      FROM sys.key_constraints kc
      INNER JOIN sys.index_columns ic
        ON kc.parent_object_id = ic.object_id AND kc.unique_index_id = ic.index_id
      INNER JOIN sys.columns c
        ON ic.object_id = c.object_id AND ic.column_id = c.column_id
      WHERE kc.parent_object_id = OBJECT_ID('projects')
        AND kc.type = 'UQ'
        AND c.name = 'Code'
    `);

    for (const row of rows) {
      await queryInterface.sequelize.query(
        `ALTER TABLE [projects] DROP CONSTRAINT [${row.constraintName}]`
      );
    }

    const [indexes] = await queryInterface.sequelize.query(`
      SELECT i.name AS indexName
      FROM sys.indexes i
      INNER JOIN sys.index_columns ic
        ON i.object_id = ic.object_id AND i.index_id = ic.index_id
      INNER JOIN sys.columns c
        ON ic.object_id = c.object_id AND ic.column_id = c.column_id
      WHERE i.object_id = OBJECT_ID('projects')
        AND i.is_unique = 1
        AND i.is_primary_key = 0
        AND i.is_unique_constraint = 0
        AND c.name = 'Code'
    `);

    for (const idx of indexes) {
      await queryInterface.sequelize.query(
        `DROP INDEX [${idx.indexName}] ON [projects]`
      );
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('projects', 'companyId');
    await queryInterface.addConstraint('projects', {
      fields: ['Code'],
      type: 'unique',
      name: 'projects_Code_unique'
    });
  }
};
