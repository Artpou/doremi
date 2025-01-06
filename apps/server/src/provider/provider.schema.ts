import { relations } from 'drizzle-orm';
import { pgEnum, pgTable, text, timestamp, serial } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { id } from '@/common/common.schema';
import { users } from '@/user/user.schema';

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

export const providersRelations = relations(providers, ({ one }) => ({
  user: one(users, {
    fields: [providers.userId],
    references: [users.id],
  }),
}));

export const Providerschema = createSelectSchema(providers);
export type ProviderResponse = z.infer<typeof Providerschema>;
