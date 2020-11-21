import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableUnique,
} from 'typeorm';

export class relRoleAction1605598913085 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'rel_role_action',
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
            name: 'action_id',
            type: 'int',
            isNullable: true,
          },
        ],
      }),
    );
    await queryRunner.createUniqueConstraint(
      'rel_role_action',
      new TableUnique({
        columnNames: ['role_id', 'action_id'],
      }),
    );
    await queryRunner.createForeignKeys('rel_role_action', [
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'role',
        onDelete: 'restrict',
      }),
      new TableForeignKey({
        columnNames: ['action_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'action',
        onDelete: 'restrict',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tb = await queryRunner.getTable('rel_role_action');
    const fk1 = tb.foreignKeys.find(
      fk => fk.columnNames.indexOf('role_id') !== -1,
    );
    const fk2 = tb.foreignKeys.find(
      fk => fk.columnNames.indexOf('action_id') !== -1,
    );
    await queryRunner.dropForeignKeys('rel_role_action', [fk1, fk2]);
    await queryRunner.dropTable('rel_role_action');
  }
}
