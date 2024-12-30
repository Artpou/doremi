import type { DrizzleDB } from 'src/drizzle/types/drizzle';

import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import * as schema from '@db/schema';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { RegisterDto } from 'src/auth/auth.dto';
import { DatabaseError } from 'pg';

@Injectable()
export class UserService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async create(dto: RegisterDto) {
    try {
      const users = await this.db
        .insert(schema.users)
        .values({
          ...dto,
          password: await hash(dto.password, 10),
        })
        .returning({
          id: schema.users.id,
          email: schema.users.email,
          name: schema.users.name,
        });

      if (!users[0]) {
        throw new Error('User creation failed');
      }

      return users[0];
    } catch (error) {
      if (error instanceof DatabaseError && error.code === '23505') {
        throw new ConflictException('email duplicated');
      }

      throw error;
    }
  }

  async exist(id: number): Promise<number | undefined> {
    const user = await this.db.query.users.findFirst({
      columns: { id: true },
      where: eq(schema.users.id, id),
    });

    return user?.id;
  }

  async findByEmail(email: string) {
    return await this.db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });
  }

  async findById(id: number) {
    return await this.db.query.users.findFirst({
      where: eq(schema.users.id, id),
    });
  }
}
