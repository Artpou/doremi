import { reviews } from 'db/schema';
import { createSelectSchema } from 'drizzle-zod';
import { createZodDto } from 'nestjs-zod';
import { AlbumSchemaWithRelations } from 'src/album/album.response';
import { z } from 'zod';

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
