import { reviews } from 'db/schema';
import { createSelectSchema } from 'drizzle-zod';
import { createZodDto } from 'nestjs-zod';
import { AlbumSchemaWithRelations } from 'src/album/album.dto';
import { z } from 'zod';

export class ListReviewsDto extends createZodDto(
  z
    .object({
      creatorId: z.number().optional(),
      albumId: z.number().optional(),
      trackId: z.number().optional(),
    })
    .default({}),
) {}

export class CreateReviewDto extends createZodDto(
  z.object({
    comment: z.string().min(1, 'Comment is required'),
    note: z.number().min(0).max(5),
  }),
) {}

export const ReviewSchema = createSelectSchema(reviews);
export class ReviewResponse extends createZodDto(ReviewSchema) {}

export const ReviewWithRelationsSchema = ReviewSchema.extend({
  album: AlbumSchemaWithRelations.nullable(),
  creator: z.object({
    id: z.number(),
    name: z.string().nullable(),
    // image: z.string().nullable(),
  }),
});
export class ReviewWithRelationsResponse extends createZodDto(
  ReviewWithRelationsSchema,
) {}
