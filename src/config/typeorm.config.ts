import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Whiteboard } from '../whiteboards/entities/whiteboard.entity';
import { WhiteboardCollaborator } from '../whiteboard-collaborators/entities/whiteboard-collaborator.entity';
import { WhiteboardSnapshot } from '../whiteboard-snapshots/entities/whiteboard-snapshot.entity';
import 'dotenv/config';

const parsePort = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const typeOrmConfig = (): TypeOrmModuleOptions & DataSourceOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parsePort(process.env.DB_PORT, 5432),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'admin',
  database: process.env.DB_NAME ?? 'whiteboard_db',
  entities: [User, Whiteboard, WhiteboardCollaborator, WhiteboardSnapshot],
  migrations: ['dist/database/migrations/*.js'],
  synchronize: true,
  logging: process.env.DB_LOGGING === 'true',
});
