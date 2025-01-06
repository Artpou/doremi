import { Injectable } from '@nestjs/common';
import { and, eq, SQL } from 'drizzle-orm';

import { CrudService } from '@/crud/crud.service';
import { Tx } from '@/drizzle/drizzle.module';

import { users, UserResponse } from './user.schema';

type Params = { email?: string; id?: number };

@Injectable()
export class UserService extends CrudService<typeof users, UserResponse> {
  entity = users;

  async findMany(params: Params & { limit?: number }, tx?: Tx) {
    const where: SQL[] = [];

    if (params.email) where.push(eq(users.email, params.email));
    if (params.id) where.push(eq(users.id, params.id));

    return await (this.db || tx).query.users.findMany({
      columns: { createdAt: false, password: false },
      where: and(...where),
      limit: params.limit,
    });
  }

  async find(params: Params, tx?: Tx) {
    const [user] = await this.findMany(params, tx);
    return user;
  }

  async findWithPassword(email: string) {
    return await this.db.query.users.findFirst({
      where: eq(users.email, email),
    });
  }
}
