module.exports = {
  type: 'mysql',
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_LOCAL_PORT),
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [__dirname + '/dist/common/models/entities/*.js'],
  migrations: ['./dist/persistence/migrations/*.js'],
  cli: {
    migrationsDir: './src/persistence/migrations',
  },
  synchronize: false,
  logging: ['schema', 'info', 'error'],
};
