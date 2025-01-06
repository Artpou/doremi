import { Injectable, NotFoundException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';

import { CrudService } from '@/crud/crud.service';
import { reviews } from '@/db/db.schema';
import { Tx } from '@/drizzle/drizzle.module';

import { ReviewResponse } from './review.schema';

type Params = { id?: number; creatorId?: number };

@Injectable()
export class ReviewService extends CrudService<typeof reviews, ReviewResponse> {
  protected entity = reviews;

  async findMany(params: Params & { limit?: number }, tx?: Tx) {
    const where = [];

    if (params.id) where.push(eq(reviews.id, params.id));
    if (params.creatorId) where.push(eq(reviews.creatorId, params.creatorId));

    return await (this.db || tx).query.reviews.findMany({
      where: and(...where),
      limit: params.limit,
      with: {
        album: {
          columns: { createdAt: false },
          with: {
            artists: { with: { artist: { columns: { createdAt: false } } } },
            tags: { with: { tag: { columns: { createdAt: false } } } },
            tracks: { columns: { createdAt: false } },
          },
        },
        creator: { columns: { createdAt: false } },
      },
    });
  }

  async find(params: Params, tx?: Tx) {
    const [review] = await this.findMany(params, tx);
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }
}
