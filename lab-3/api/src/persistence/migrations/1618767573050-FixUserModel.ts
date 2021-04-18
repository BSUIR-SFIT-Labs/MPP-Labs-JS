import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixUserModel1618767573050 implements MigrationInterface {
  name = 'FixUserModel1618767573050';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `todo_items` DROP FOREIGN KEY `FK_cde7a1cfaa29ff1e3521798d932`',
    );
    await queryRunner.query('DROP INDEX `IDX_cde7a1cfaa29ff1e3521798d93` ON `todo_items`');
    await queryRunner.query('DROP INDEX `REL_cde7a1cfaa29ff1e3521798d93` ON `todo_items`');
    await queryRunner.query(
      'ALTER TABLE `todo_items` ADD CONSTRAINT `FK_cde7a1cfaa29ff1e3521798d932` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `todo_items` DROP FOREIGN KEY `FK_cde7a1cfaa29ff1e3521798d932`',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `REL_cde7a1cfaa29ff1e3521798d93` ON `todo_items` (`userId`)',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_cde7a1cfaa29ff1e3521798d93` ON `todo_items` (`userId`)',
    );
    await queryRunner.query(
      'ALTER TABLE `todo_items` ADD CONSTRAINT `FK_cde7a1cfaa29ff1e3521798d932` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }
}
