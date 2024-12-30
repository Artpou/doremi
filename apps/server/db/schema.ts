import {
  integer,
  serial,
  text,
  pgTable,
  varchar,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
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

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password'),
  name: varchar('name', { length: 255 }),
  roleId: integer('role_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const usersRelations = relations(users, ({ one }) => ({
  providers: one(providers),
}));
