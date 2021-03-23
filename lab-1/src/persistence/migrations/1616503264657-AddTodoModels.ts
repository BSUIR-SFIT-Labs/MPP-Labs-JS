import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTodoModels1616503264657 implements MigrationInterface {
  name = 'AddTodoModels1616503264657';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `todo_items` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(50) NOT NULL, `description` varchar(255) NULL, `due_date` datetime NULL, `is_done` tinyint NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `attachments` (`id` int NOT NULL AUTO_INCREMENT, `path_to_attachment` varchar(4096) NOT NULL, `todoItemId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'ALTER TABLE `attachments` ADD CONSTRAINT `FK_5574cfcae6b09a3830ab36cc4f7` FOREIGN KEY (`todoItemId`) REFERENCES `todo_items`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `attachments` DROP FOREIGN KEY `FK_5574cfcae6b09a3830ab36cc4f7`',
    );
    await queryRunner.query('DROP TABLE `attachments`');
    await queryRunner.query('DROP TABLE `todo_items`');
  }
}
