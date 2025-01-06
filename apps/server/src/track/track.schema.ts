import { relations } from 'drizzle-orm';
import { pgTable, varchar, integer } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import z from 'zod';

import { albums } from '@/album/album.schema';
import { id, createdAt, providersIds } from '@/common/common.schema';
import { tracksToArtists } from '@/db/db.schema';

export const tracks = pgTable('tracks', {
  id,
  title: varchar('title', { length: 255 }),
  albumId: integer('album_id').references(() => albums.id, {
    onDelete: 'cascade',
  }),
  duration: integer('duration'),
  ...providersIds,
  createdAt,
});

export const tracksRelations = relations(tracks, ({ one, many }) => ({
  album: one(albums, {
    fields: [tracks.albumId],
    references: [albums.id],
  }),
  artists: many(tracksToArtists),
}));

export const TrackSchema = createSelectSchema(tracks).omit({
  createdAt: true,
});

export const TrackResponseSchema = TrackSchema.extend({
  // artists: z.array(BaseArtistResponseSchema).default([]),
});

export type TrackResponse = z.infer<typeof TrackResponseSchema>;
