import type { DrizzleDB } from 'src/drizzle/types/drizzle';

import { Inject, Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { users } from 'db/schema';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { Model } from 'db/types';

@Injectable()
export class UserService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async create(dto: Partial<Model<'users'>> & { email: string }) {
    const [user] = await this.db
      .insert(users)
      .values({
        ...dto,
        password: dto.password ? await hash(dto.password, 10) : undefined,
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
      });

    if (!user) throw new Error('User creation failed');
    return user;
  }

  async update(id: number, dto: Partial<Model<'users'>>) {
    return await this.db.update(users).set(dto).where(eq(users.id, id));
  }

  async exist(id: number): Promise<number | undefined> {
    const user = await this.db.query.users.findFirst({
      columns: { id: true },
      where: eq(users.id, id),
    });

    return user?.id;
  }

  async findByEmail(email: string) {
    return await this.db.query.users.findFirst({
      where: eq(users.email, email),
    });
  }

  async findById(id: number) {
    return await this.db.query.users.findFirst({
      where: eq(users.id, id),
    });
  }
}
