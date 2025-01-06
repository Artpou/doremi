import { pgTable, varchar, text, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { id, createdAt } from '@/common/common.schema';
import { providers } from '@/provider/provider.schema';
import { likedAlbums } from '@/relations/relations.schema';
import { reviews } from '@/review/review.schema';

export const users = pgTable('users', {
  id,
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password'),
  name: varchar('name', { length: 255 }),
  roleId: integer('role_id'),
  createdAt,
});

export const usersRelations = relations(users, ({ one, many }) => ({
  providers: one(providers),
  likedAlbums: many(likedAlbums),
  albumReviews: many(reviews),
}));

export const UserSchema = createSelectSchema(users).omit({
  password: true,
  createdAt: true,
});

export type UserResponse = z.infer<typeof UserSchema>;
