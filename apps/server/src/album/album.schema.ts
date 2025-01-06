import { relations } from 'drizzle-orm';
import { pgTable, varchar, timestamp, text } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import z from 'zod';

import { ArtistSchema } from '@/artist/artist.schema';
import { id, createdAt, providersIds } from '@/common/common.schema';
import {
  albumsToArtists,
  albumTags,
  likedAlbums,
  reviews,
  tracks,
} from '@/db/db.schema';
import { TagSchema } from '@/tag/tag.schema';
import { TrackSchema } from '@/track/track.schema';

export const albums = pgTable('albums', {
  id,
  title: varchar('title', { length: 255 }),
  releaseDate: timestamp('release_date'),
  image: text('cover_image'),
  ...providersIds,
  createdAt,
});

export const albumsRelations = relations(albums, ({ many }) => ({
  tags: many(albumTags),
  likes: many(likedAlbums),
  reviews: many(reviews),
  artists: many(albumsToArtists),
  tracks: many(tracks),
}));

export const AlbumSchema = createSelectSchema(albums).omit({
  createdAt: true,
});

export const AlbumResponseSchema = AlbumSchema.extend({
  tracks: z.array(TrackSchema).default([]),
  artists: z.array(z.object({ artist: ArtistSchema })).default([]),
  tags: z.array(z.object({ tag: TagSchema })).default([]),
});

export type AlbumResponse = z.infer<typeof AlbumResponseSchema>;
