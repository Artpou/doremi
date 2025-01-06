import { relations } from 'drizzle-orm';
import { pgTable, varchar, text } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import z from 'zod';

import { AlbumSchema } from '@/album/album.schema';
import { id, createdAt, providersIds } from '@/common/common.schema';
import { tracksToArtists, albumsToArtists } from '@/relations/relations.schema';

export const artists = pgTable('artists', {
  id,
  name: varchar('name', { length: 255 }),
  image: text('image'),
  ...providersIds,
  createdAt,
});

export const artistsRelations = relations(artists, ({ many }) => ({
  albums: many(albumsToArtists),
  tracks: many(tracksToArtists),
}));

export const ArtistSchema = createSelectSchema(artists).omit({
  createdAt: true,
});

export const ArtistResponseSchema = ArtistSchema.extend({
  albums: z.lazy(() => z.array(z.object({ album: AlbumSchema }))).default([]),
});

export type ArtistResponse = z.infer<typeof ArtistResponseSchema>;
