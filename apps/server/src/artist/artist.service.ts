import type { DrizzleDB } from 'src/drizzle/types/drizzle';

import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { artists } from 'db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class ArtistService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async list() {
    return await this.db.query.artists.findMany({});
  }

  async get(id: number) {
    return await this.db.query.artists.findFirst({
      where: eq(artists.id, id),
    });
  }
}
