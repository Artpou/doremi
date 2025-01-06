import { serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const id = serial('id').primaryKey();
export const createdAt = timestamp('created_at').defaultNow().notNull();

export const providersIds = {
  spotifyId: varchar('spotify_id', { length: 255 }),
  appleId: varchar('apple_id', { length: 255 }),
};
