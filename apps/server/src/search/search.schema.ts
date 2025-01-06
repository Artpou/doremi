import { z } from 'zod';

import { AlbumResponseSchema } from '@/album/album.schema';

export const SearchResponseSchema = z.object({
  albums: z.array(AlbumResponseSchema).default([]),
});

export type SearchResponse = z.infer<typeof SearchResponseSchema>;
