import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class role1605595684310 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'role',
        columns: [
          {
            name: 'id',
            type: 'int',
            isGenerated: true,
            generationStrategy: 'increment',
            isPrimary: true,
          },
          {
            name: 'code',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'disabled',
            type: 'boolean',
            default: false,
          },
        ],
      }),
    );

    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'role_id',
        type: 'int',
        isNullable: true,
      }),
    );
    await queryRunner.createForeignKey(
      'user',
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'role',
        onDelete: 'restrict',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tb = await queryRunner.getTable('user');
    const fk = tb.foreignKeys.find(
      fk => fk.columnNames.indexOf('role_id') !== -1,
    );
    await queryRunner.dropForeignKey('user', fk);
    await queryRunner.dropTable('role');
  }
}
