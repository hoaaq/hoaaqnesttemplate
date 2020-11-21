import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class menu1605602556396 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'menu',
        columns: [
          {
            name: 'id',
            type: 'int',
            isGenerated: true,
            generationStrategy: 'increment',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'slug',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'icon',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'order',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'disabled',
            type: 'boolean',
            default: false,
          },
          {
            name: 'parent_id',
            type: 'int',
            isNullable: true,
          },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'menu',
      new TableForeignKey({
        columnNames: ['parent_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'menu',
        onDelete: 'restrict',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tb = await queryRunner.getTable('menu');
    const fk = tb.foreignKeys.find(
      fk => fk.columnNames.indexOf('parent_id') !== -1,
    );
    await queryRunner.dropForeignKey('menu', fk);
    await queryRunner.dropTable('menu');
  }
}
