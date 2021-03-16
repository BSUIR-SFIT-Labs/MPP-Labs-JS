import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTodoItemModel1615889006371 implements MigrationInterface {
  name = 'AddTodoItemModel1615889006371';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `todo_items` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(50) NOT NULL, `description` varchar(255) NOT NULL, `due_date` datetime NOT NULL, `is_done` tinyint NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `todo_items`');
  }
}
