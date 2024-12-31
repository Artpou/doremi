import type { DrizzleDB } from 'src/drizzle/types/drizzle';

import { Inject, Injectable } from '@nestjs/common';
import * as schema from 'db/schema';
import { eq, InferSelectModel } from 'drizzle-orm';
import { DRIZZLE } from 'src/drizzle/drizzle.module';

@Injectable()
export class ProviderService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async create(
    dto: Partial<InferSelectModel<typeof schema.providers>> & { id: string },
  ) {
    const [provider] = await this.db
      .insert(schema.providers)
      .values(dto)
      .returning();

    if (!provider) {
      throw new Error('Provider creation failed');
    }

    return provider;
  }

  async update(
    id: string,
    dto: Partial<InferSelectModel<typeof schema.providers>>,
  ) {
    return await this.db
      .update(schema.providers)
      .set(dto)
      .where(eq(schema.providers.id, id))
      .returning();
  }

  async findByUserId(userId: number) {
    return await this.db.query.providers.findFirst({
      where: eq(schema.providers.userId, userId),
    });
  }
}
