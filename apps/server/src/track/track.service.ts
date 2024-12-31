import type { DrizzleDB } from 'src/drizzle/types/drizzle';

import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { tracks, reviews } from 'db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class TrackService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async list() {
    return await this.db.query.tracks.findMany({
      limit: 20,
    });
  }

  async get(id: number) {
    return await this.db.query.tracks.findFirst({
      where: eq(tracks.id, id),
    });
  }

  async reviews(id: number) {
    return await this.db.query.reviews.findMany({
      where: eq(reviews.trackId, id),
    });
  }
}
