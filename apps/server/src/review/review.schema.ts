import { relations } from 'drizzle-orm';
import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { AlbumSchema } from '@/album/album.schema';
import { ArtistSchema } from '@/artist/artist.schema';
import { createdAt, id } from '@/common/common.schema';
import { albums, users } from '@/db/db.schema';
import { TagSchema } from '@/tag/tag.schema';
import { TrackSchema } from '@/track/track.schema';
import { UserSchema } from '@/user/user.schema';

export const reviews = pgTable('reviews', {
  id,
  creatorId: integer('creator_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  albumId: integer('album_id')
    .references(() => albums.id, { onDelete: 'cascade' })
    .notNull(),
  note: integer('note').notNull(),
  comment: text('comment'),
  createdAt,
});

export const reviewsRelations = relations(reviews, ({ one }) => ({
  album: one(albums, {
    fields: [reviews.albumId],
    references: [albums.id],
  }),
  creator: one(users, {
    fields: [reviews.creatorId],
    references: [users.id],
  }),
}));

export const ReviewSchema = createSelectSchema(reviews);
export type SimpleReviewResponse = z.infer<typeof ReviewSchema>;

export const ReviewResponseSchema = ReviewSchema.extend({
  album: z.lazy(() =>
    AlbumSchema.extend({
      tags: z.array(z.object({ tag: TagSchema })).default([]),
      artists: z.array(z.object({ artist: ArtistSchema })).default([]),
      tracks: z.array(TrackSchema).default([]),
    }),
  ),
  creator: z.lazy(() => UserSchema),
});

export type ReviewResponse = z.infer<typeof ReviewResponseSchema>;

export class ReviewResponseDto extends createZodDto(ReviewResponseSchema) {}
