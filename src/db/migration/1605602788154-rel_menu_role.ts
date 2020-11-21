import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableUnique,
} from 'typeorm';

export class relMenuRole1605602788154 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'rel_menu_role',
        columns: [
          {
            name: 'id',
            type: 'int',
            isGenerated: true,
            generationStrategy: 'increment',
            isPrimary: true,
          },
          {
            name: 'role_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'menu_id',
            type: 'int',
            isNullable: true,
          },
        ],
      }),
    );
    await queryRunner.createUniqueConstraint(
      'rel_menu_role',
      new TableUnique({
        columnNames: ['role_id', 'menu_id'],
      }),
    );
    await queryRunner.createForeignKeys('rel_menu_role', [
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'role',
        onDelete: 'restrict',
      }),
      new TableForeignKey({
        columnNames: ['menu_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'menu',
        onDelete: 'restrict',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tb = await queryRunner.getTable('rel_menu_role');
    const fk1 = tb.foreignKeys.find(
      fk => fk.columnNames.indexOf('role_id') !== -1,
    );
    const fk2 = tb.foreignKeys.find(
      fk => fk.columnNames.indexOf('menu_id') !== -1,
    );
    await queryRunner.dropForeignKeys('rel_menu_role', [fk1, fk2]);
    await queryRunner.dropTable('rel_menu_role');
  }
}
