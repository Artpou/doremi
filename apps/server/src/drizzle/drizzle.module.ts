import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from '@/db/db.schema';

export const DRIZZLE = Symbol('drizzle-connection');

import { DrizzleDB } from './types/drizzle';

export type Tx = Parameters<Parameters<DrizzleDB['transaction']>[0]>[0];

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const databasURL = configService.get<string>('DATABASE_URL');
        const pool = new Pool({
          connectionString: databasURL,
          ssl: process.env.NODE_ENV === 'development' ? false : true,
        });
        return drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DrizzleModule {}
