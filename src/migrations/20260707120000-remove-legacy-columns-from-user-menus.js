'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface) {
    const { sequelize } = queryInterface;

    const dropConstraints = async (query) => {
      const [rows] = await sequelize.query(query);
      for (const row of rows) {
        await sequelize.query(`ALTER TABLE [user_menus] DROP CONSTRAINT [${row.name}]`);
      }
    };

    await dropConstraints(`
      SELECT fk.name
      FROM sys.foreign_keys fk
      JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
      JOIN sys.columns c ON fkc.parent_object_id = c.object_id AND fkc.parent_column_id = c.column_id
      WHERE fk.parent_object_id = OBJECT_ID('user_menus') AND c.name = 'branchId'
    `);

    await dropConstraints(`
      SELECT dc.name
      FROM sys.default_constraints dc
      JOIN sys.columns c ON dc.parent_object_id = c.object_id AND dc.parent_column_id = c.column_id
      WHERE dc.parent_object_id = OBJECT_ID('user_menus') AND c.name = 'scope'
    `);

    await dropConstraints(`
      SELECT cc.name
      FROM sys.check_constraints cc
      WHERE cc.parent_object_id = OBJECT_ID('user_menus') AND cc.definition LIKE '%[[]scope]%'
    `);

    await queryInterface.removeColumn('user_menus', 'branchId');
    await queryInterface.removeColumn('user_menus', 'scope');
    await queryInterface.removeColumn('user_menus', 'parent');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('user_menus', 'parent', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('user_menus', 'scope', {
      type: Sequelize.ENUM('global', 'company', 'branch'),
      allowNull: false,
      defaultValue: 'global'
    });
    await queryInterface.addColumn('user_menus', 'branchId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'branches', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }
};
