import type { DrizzleDB } from 'src/drizzle/types/drizzle';

import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { reviews } from 'db/schema';
import { and, eq, isNotNull } from 'drizzle-orm';
import {
  CreateReviewSchema,
  ListReviewsSchema,
} from '@workspace/dto/review.dto';
import z from 'zod';

@Injectable()
export class ReviewService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async list({
    creatorId,
    albumId,
    trackId,
  }: z.infer<typeof ListReviewsSchema>) {
    return await this.db.query.reviews.findMany({
      where: and(
        creatorId ? eq(reviews.creatorId, creatorId) : undefined,
        albumId ? eq(reviews.albumId, albumId) : undefined,
        trackId ? eq(reviews.trackId, trackId) : undefined,
        isNotNull(reviews.albumId),
      ),
      with: {
        creator: {
          columns: {
            id: true,
            name: true,
            // image: true,
          },
        },
        album: {
          with: {
            artists: {
              with: {
                artist: true,
              },
            },
          },
        },
      },
    });
  }

  async get(id: number) {
    return await this.db.query.reviews.findFirst({
      where: eq(reviews.id, id),
    });
  }

  async create(
    dto: z.infer<typeof CreateReviewSchema> & { creatorId: number },
  ) {
    console.log('🚀 ~ ReviewService ~ create ~ dto:', dto);
    const [review] = await this.db.insert(reviews).values(dto).returning();
    return review;
  }

  async update(
    id: number,
    dto: z.infer<typeof CreateReviewSchema> & { creatorId: number },
  ) {
    const [review] = await this.db
      .update(reviews)
      .set(dto)
      .where(eq(reviews.id, id))
      .returning();

    return review;
  }

  async delete(id: number) {
    const [review] = await this.db
      .delete(reviews)
      .where(eq(reviews.id, id))
      .returning();

    return review;
  }
}
