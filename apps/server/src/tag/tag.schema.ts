import { relations } from 'drizzle-orm';
import { pgTable, varchar } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { AlbumSchema } from '@/album/album.schema';
import { id, createdAt } from '@/common/common.schema';
import { albumTags } from '@/db/db.schema';

export const tags = pgTable('tags', {
  id,
  name: varchar('name', { length: 50 }).notNull().unique(),
  createdAt,
});

export const tagsRelations = relations(tags, ({ many }) => ({
  albums: many(albumTags),
}));

export const TagSchema = createSelectSchema(tags).omit({
  createdAt: true,
});

export const TagResponseSchema = TagSchema.extend({
  albums: z.lazy(() => z.array(AlbumSchema).default([])),
});

export type TagResponse = z.infer<typeof TagResponseSchema>;
