import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAttachmentModel1615889700664 implements MigrationInterface {
  name = 'AddAttachmentModel1615889700664';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `attachments` (`id` int NOT NULL AUTO_INCREMENT, `path_to_attachment` varchar(4096) NOT NULL, `todoItemId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'ALTER TABLE `attachments` ADD CONSTRAINT `FK_5574cfcae6b09a3830ab36cc4f7` FOREIGN KEY (`todoItemId`) REFERENCES `todo_items`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `attachments` DROP FOREIGN KEY `FK_5574cfcae6b09a3830ab36cc4f7`',
    );
    await queryRunner.query('DROP TABLE `attachments`');
  }
}
