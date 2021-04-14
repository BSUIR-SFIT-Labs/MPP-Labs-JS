import { createConnection } from 'typeorm';
import { Attachment } from '../common/models/entities/attachment';
import { TodoItem } from '../common/models/entities/todoItem';
import { User } from '../common/models/entities/user';

export default async function configureDatabaseConnection() {
  const connection = await createConnection({
    type: 'mysql',
    host: process.env.MYSQL_HOST_DOCKER,
    port: parseInt(process.env.MYSQL_DOCKER_PORT),
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    entities: [TodoItem, Attachment, User],
    migrations: ['**/migrations/*.js'],
    logging: ['schema', 'info', 'error'],
    synchronize: false,
  });

  await connection.runMigrations({ transaction: 'all' });
}
