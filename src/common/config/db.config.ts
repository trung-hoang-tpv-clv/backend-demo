import { registerAs } from '@nestjs/config';
import { resolve } from 'path';
import { TypeormNamingStrategy } from '../utils';
import { dbConfig } from '../constant';

export default registerAs(dbConfig, () => ({
  type: process.env.DB_CONNECTION,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  timezone: 'Z',
  logging: process.env.DB_LOGGING === 'true',
  autoLoadEntities: true,
  keepConnectionAlive: true,
  entities: [resolve(__dirname, '../../domain/entities', '**/*.entity.ts')],
  namingStrategy: new TypeormNamingStrategy(),
}));
