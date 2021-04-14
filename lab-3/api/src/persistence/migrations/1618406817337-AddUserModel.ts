import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserModel1618406817337 implements MigrationInterface {
  name = 'AddUserModel1618406817337';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `users` (`id` int NOT NULL AUTO_INCREMENT, `email` varchar(254) NOT NULL, `password_hash` varchar(60) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query('ALTER TABLE `todo_items` ADD `userId` int NULL');
    await queryRunner.query(
      'ALTER TABLE `todo_items` ADD UNIQUE INDEX `IDX_cde7a1cfaa29ff1e3521798d93` (`userId`)',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `REL_cde7a1cfaa29ff1e3521798d93` ON `todo_items` (`userId`)',
    );
    await queryRunner.query(
      'ALTER TABLE `todo_items` ADD CONSTRAINT `FK_cde7a1cfaa29ff1e3521798d932` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `todo_items` DROP FOREIGN KEY `FK_cde7a1cfaa29ff1e3521798d932`',
    );
    await queryRunner.query('DROP INDEX `REL_cde7a1cfaa29ff1e3521798d93` ON `todo_items`');
    await queryRunner.query('ALTER TABLE `todo_items` DROP INDEX `IDX_cde7a1cfaa29ff1e3521798d93`');
    await queryRunner.query('ALTER TABLE `todo_items` DROP COLUMN `userId`');
    await queryRunner.query('DROP TABLE `users`');
  }
}
