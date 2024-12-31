import type * as schema from './schema';
import type {
  BuildQueryResult,
  DBQueryConfig,
  ExtractTablesWithRelations,
} from 'drizzle-orm';
import type { Exact } from 'type-fest';

type TSchema = ExtractTablesWithRelations<typeof schema>;

type QueryConfig<TableName extends keyof TSchema> = DBQueryConfig<
  'one' | 'many',
  boolean,
  TSchema,
  TSchema[TableName]
>;

export type Model<
  TableName extends keyof TSchema,
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  QBConfig extends Exact<QueryConfig<TableName>, QBConfig> = {},
> = BuildQueryResult<TSchema, TSchema[TableName], QBConfig>;