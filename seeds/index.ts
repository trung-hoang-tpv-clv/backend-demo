import { DataSource } from 'typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { TypeormNamingStrategy } from '../src/common/utils';

dotenv.config({ path: join(__dirname, `../.env`) });

export default new DataSource({
  type: 'mysql',
  name: 'seed',
  host: process.env.DB_HOST,
  port: parseInt(`${process.env.DB_PORT}`, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [join(__dirname, '../src/**/*.entity.ts')],
  synchronize: false,
  migrationsRun: true,
  logging: true,
  migrationsTableName: '__seeds',
  migrations: [join(__dirname, 'scripts/*.ts')],
  namingStrategy: new TypeormNamingStrategy(),
});
