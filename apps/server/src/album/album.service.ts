import type { DrizzleDB } from 'src/drizzle/types/drizzle';

import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { albums, reviews, tracks } from 'db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class AlbumService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async list() {
    return await this.db.query.albums.findMany({});
  }

  async get(id: number) {
    return await this.db.query.albums.findFirst({
      where: eq(albums.id, id),
      with: {
        artists: {
          with: {
            artist: true,
          },
        },
      },
    });
  }

  async reviews(id: number) {
    return await this.db.query.reviews.findMany({
      where: eq(reviews.albumId, id),
    });
  }

  async tracks(id: number) {
    return await this.db.query.tracks.findMany({
      where: eq(tracks.albumId, id),
    });
  }
}
