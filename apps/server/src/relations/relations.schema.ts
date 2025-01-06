import { relations } from 'drizzle-orm';
import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';

import { albums } from '@/album/album.schema';
import { artists } from '@/artist/artist.schema';
import { createdAt } from '@/common/common.schema';
import { tags } from '@/tag/tag.schema';
import { tracks } from '@/track/track.schema';
import { users } from '@/user/user.schema';

export const albumsToArtists = pgTable(
  'albums_to_artists',
  {
    albumId: integer('album_id')
      .notNull()
      .references(() => albums.id, { onDelete: 'cascade' }),
    artistId: integer('artist_id')
      .notNull()
      .references(() => artists.id, { onDelete: 'cascade' }),
    createdAt,
  },
  (t) => [primaryKey({ columns: [t.albumId, t.artistId] })],
);

export const albumToArtistsRelations = relations(
  albumsToArtists,
  ({ one }) => ({
    album: one(albums, {
      fields: [albumsToArtists.albumId],
      references: [albums.id],
    }),
    artist: one(artists, {
      fields: [albumsToArtists.artistId],
      references: [artists.id],
    }),
  }),
);

export const tracksToArtists = pgTable(
  'tracks_to_artists',
  {
    trackId: integer('track_id')
      .notNull()
      .references(() => tracks.id, { onDelete: 'cascade' }),
    artistId: integer('artist_id')
      .notNull()
      .references(() => artists.id, { onDelete: 'cascade' }),
    createdAt,
  },
  (t) => [primaryKey({ columns: [t.trackId, t.artistId] })],
);

export const tracksToArtistsRelations = relations(
  tracksToArtists,
  ({ one }) => ({
    track: one(tracks, {
      fields: [tracksToArtists.trackId],
      references: [tracks.id],
    }),
    artist: one(artists, {
      fields: [tracksToArtists.artistId],
      references: [artists.id],
    }),
  }),
);

export const albumTags = pgTable(
  'album_tags',
  {
    albumId: integer('album_id')
      .notNull()
      .references(() => albums.id, { onDelete: 'cascade' }),
    tagId: integer('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
    createdAt,
  },
  (t) => [primaryKey({ columns: [t.albumId, t.tagId] })],
);

export const albumTagsRelations = relations(albumTags, ({ one }) => ({
  album: one(albums, {
    fields: [albumTags.albumId],
    references: [albums.id],
  }),
  tag: one(tags, {
    fields: [albumTags.tagId],
    references: [tags.id],
  }),
}));

export const likedAlbums = pgTable(
  'liked_albums',
  {
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    albumId: integer('album_id')
      .notNull()
      .references(() => albums.id, { onDelete: 'cascade' }),
    createdAt,
  },
  (t) => [primaryKey({ columns: [t.userId, t.albumId] })],
);

export const likedAlbumsRelations = relations(likedAlbums, ({ one }) => ({
  album: one(albums, {
    fields: [likedAlbums.albumId],
    references: [albums.id],
  }),
  user: one(users, {
    fields: [likedAlbums.userId],
    references: [users.id],
  }),
}));
