import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import * as schema from '@/db/db.schema';

export type DrizzleDB = NodePgDatabase<typeof schema>;
