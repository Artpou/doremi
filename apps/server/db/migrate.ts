/* eslint-disable no-console */
import { join } from 'path';

import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const runMigrations = async () => {
  const db = drizzle(pool);
  console.log('Running migrations...');

  await migrate(db, {
    migrationsFolder: join(process.cwd(), 'drizzle'),
  });

  console.log('Migrations completed!');
  await pool.end();
};

runMigrations().catch((err) => {
  console.error('Migration failed!', err);
  process.exit(1);
});
