import { Inject, Injectable } from '@nestjs/common';
import {
  eq,
  inArray,
  InferInsertModel,
  InferSelectModel,
  OneOrMany,
  Table,
} from 'drizzle-orm';
import { getTableName } from 'drizzle-orm';
import { Logger } from 'nestjs-pino';
import { DRIZZLE, Tx } from 'src/drizzle/drizzle.module';

import type { DrizzleDB } from '../drizzle/types/drizzle';

@Injectable()
export abstract class CrudService<Schema extends Table, Response> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected abstract entity: Table & { id: any };
  protected select!: InferSelectModel<Schema>;
  protected insert!: InferInsertModel<Schema>;
  protected tableName!: string;

  constructor(
    @Inject(DRIZZLE) protected readonly db: DrizzleDB,
    protected readonly logger: Logger,
  ) {}

  abstract findMany(
    params: { id?: number; limit?: number },
    tx?: Tx,
  ): Promise<Response[]>;

  abstract find(
    params: { id?: number },
    tx?: Tx,
  ): Promise<Response | undefined>;

  async findById(id: number, tx?: Tx): Promise<Response | undefined> {
    return await this.find({ id: Number(id) }, tx);
  }

  async exist(params: { id: number }, tx?: Tx): Promise<boolean> {
    const [entity] = await (this.db || tx)
      .select({ id: this.entity.id })
      .from(this.entity)
      .where(
        Array.isArray(params.id)
          ? inArray(this.entity.id, params.id)
          : eq(this.entity.id, params.id),
      );

    return !!entity;
  }

  async create(values: OneOrMany<typeof this.insert>, tx?: Tx) {
    try {
      return (await (this.db || tx)
        .insert(this.entity)
        .values(values)
        .returning()) as (typeof this.select)[];
    } catch (error) {
      this.logger?.error(
        `Failed to create in ${getTableName(this.entity)} with ${JSON.stringify(values)}`,
      );
      throw error;
    }
  }

  async update(
    id: number | number[],
    values: OneOrMany<Partial<typeof this.select>>,
    tx?: Tx,
  ) {
    try {
      return (await (this.db || tx)
        .update(this.entity)
        .set(values)
        .where(
          Array.isArray(id)
            ? inArray(this.entity.id, id)
            : eq(this.entity.id, id),
        )
        .returning()) as (typeof this.select)[];
    } catch (error) {
      this.logger?.error(
        `Failed to update ${id} in ${getTableName(this.entity)} with ${JSON.stringify(values)}`,
      );
      throw error;
    }
  }

  async delete(id: number | number[], tx?: Tx) {
    try {
      return (await (this.db || tx)
        .delete(this.entity)
        .where(
          Array.isArray(id)
            ? inArray(this.entity.id, id)
            : eq(this.entity.id, id),
        )
        .returning()) as (typeof this.select)[];
    } catch (error) {
      this.logger?.error(
        `Failed to delete ${id} in ${getTableName(this.entity)}`,
      );
      throw error;
    }
  }
}
