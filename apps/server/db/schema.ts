import { relations } from 'drizzle-orm';
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  primaryKey,
} from 'drizzle-orm/pg-core';

const id = serial('id').primaryKey();
const createdAt = timestamp('created_at').defaultNow().notNull();
const providersIds = {
  spotifyId: varchar('spotify_id', { length: 255 }),
  appleId: varchar('apple_id', { length: 255 }),
};

export const users = pgTable('users', {
  id,
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password'),
  name: varchar('name', { length: 255 }),
  roleId: integer('role_id'),
  createdAt,
});

export const providerEnum = pgEnum('provider', [
  'credentials',
  'spotify',
  'apple',
]);

export const providers = pgTable('providers', {
  id,
  name: providerEnum('name'),
  access_token: text('access_token'),
  refresh_token: text('refresh_token'),
  expiresAt: timestamp('expires_at'),
  userId: serial('user_id').references(() => users.id, { onDelete: 'cascade' }),
});

export const tags = pgTable('tags', {
  id,
  name: varchar('name', { length: 50 }).notNull().unique(),
  createdAt,
});

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

export const albums = pgTable('albums', {
  id,
  title: varchar('title', { length: 255 }),
  releaseDate: timestamp('release_date'),
  image: text('cover_image'),
  ...providersIds,
  createdAt,
});

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

export const artists = pgTable('artists', {
  id,
  name: varchar('name', { length: 255 }),
  image: text('image'),
  ...providersIds,
  createdAt,
});

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

export const usersRelations = relations(users, ({ one, many }) => ({
  providers: one(providers),
  likedAlbums: many(likedAlbums),
  albumReviews: many(reviews),
}));

export const providersRelations = relations(providers, ({ one }) => ({
  user: one(users, {
    fields: [providers.userId],
    references: [users.id],
  }),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  albums: many(albumTags),
}));

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

export const albumsRelations = relations(albums, ({ many }) => ({
  tags: many(albumTags),
  likes: many(likedAlbums),
  reviews: many(reviews),
  artists: many(albumsToArtists),
  tracks: many(tracks),
}));

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

export const tracksRelations = relations(tracks, ({ one, many }) => ({
  album: one(albums, {
    fields: [tracks.albumId],
    references: [albums.id],
  }),
  artists: many(tracksToArtists),
}));

export const artistsRelations = relations(artists, ({ many }) => ({
  albums: many(albumsToArtists),
  tracks: many(tracksToArtists),
}));

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
