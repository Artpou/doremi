import {
  integer,
  serial,
  text,
  pgTable,
  varchar,
  timestamp,
  pgEnum,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

const timeStamps = {
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
};

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password'),
  name: varchar('name', { length: 255 }),
  roleId: integer('role_id'),
  ...timeStamps,
});

export const usersRelations = relations(users, ({ one, many }) => ({
  providers: one(providers),
  reviews: many(reviews),
}));

export const providerEnum = pgEnum('provider', [
  'credentials',
  'spotify',
  'apple',
]);

export const providers = pgTable('providers', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: providerEnum(),
  access_token: text('access_token'),
  refresh_token: text('refresh_token'),
  expiresAt: timestamp('expires_at'),
  userId: serial('user_id').references(() => users.id),
});

export const providersRelations = relations(providers, ({ one }) => ({
  user: one(users, {
    fields: [providers.userId],
    references: [users.id],
  }),
}));

const providerInfos = {
  spotifyId: varchar('spotify_id', { length: 255 }),
  appleId: varchar('apple_id', { length: 255 }),
};

export const artists = pgTable('artists', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  image: varchar('image', { length: 511 }),
  bio: text('bio'),
  ...providerInfos,
  ...timeStamps,
});

export const artistsRelations = relations(artists, ({ many }) => ({
  albums: many(albumsToArtists),
}));

export const albums = pgTable('albums', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  image: varchar('image', { length: 511 }),
  releaseYear: integer('release_year'),
  ...providerInfos,
  ...timeStamps,
});

export const albumsRelations = relations(albums, ({ many }) => ({
  artists: many(albumsToArtists),
  tracks: many(tracks),
  reviews: many(reviews),
}));

export const albumsToArtists = pgTable(
  'albums_to_artists',
  {
    albumId: integer('album_id')
      .references(() => albums.id)
      .notNull(),
    artistId: integer('artist_id')
      .references(() => artists.id)
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.albumId, t.artistId] }),
  }),
);

export const albumsToArtistsRelations = relations(
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

export const tracks = pgTable('tracks', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  duration: integer('duration').notNull(),
  albumId: integer('album_id').references(() => albums.id),
  ...providerInfos,
  ...timeStamps,
});

export const tracksRelations = relations(tracks, ({ one, many }) => ({
  album: one(albums, {
    fields: [tracks.albumId],
    references: [albums.id],
  }),
  reviews: many(reviews),
}));

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  note: integer('note').notNull(),
  comment: varchar('comment', { length: 5000 }),
  creatorId: serial('user_id')
    .references(() => users.id)
    .notNull(),
  albumId: integer('album_id').references(() => albums.id),
  trackId: integer('track_id').references(() => tracks.id),
  ...timeStamps,
});

export const reviewsRelations = relations(reviews, ({ one }) => ({
  creator: one(users, {
    fields: [reviews.creatorId],
    references: [users.id],
  }),
  album: one(albums, {
    fields: [reviews.albumId],
    references: [albums.id],
  }),
  track: one(tracks, {
    fields: [reviews.trackId],
    references: [tracks.id],
  }),
}));
