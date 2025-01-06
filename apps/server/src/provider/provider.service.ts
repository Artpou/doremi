import { Injectable, NotFoundException } from '@nestjs/common';
import { and, eq, SQL } from 'drizzle-orm';

import { CrudService } from '@/crud/crud.service';
import { providers } from '@/db/db.schema';
import { Tx } from '@/drizzle/drizzle.module';

import { ProviderResponse } from './provider.schema';

type Params = { id?: number; userId?: number };

@Injectable()
export class ProviderService extends CrudService<
  typeof providers,
  ProviderResponse
> {
  protected entity = providers;

  async findMany(params: Params & { limit?: number }, tx?: Tx) {
    const where: SQL[] = [];

    if (params.id) where.push(eq(providers.id, params.id));
    if (params.userId) where.push(eq(providers.userId, params.userId));

    return await (this.db || tx).query.providers.findMany({
      where: and(...where),
      limit: params.limit,
    });
  }

  async find(params: Params, tx?: Tx) {
    const [provider] = await this.findMany(params, tx);
    if (!provider) throw new NotFoundException('Provider not found');
    return provider;
  }
}
