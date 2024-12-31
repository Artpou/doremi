import { createZodDto } from 'nestjs-zod';
import { AlbumSchemaWithRelations } from 'src/album/album.dto';
import { z } from 'zod';

export class SearchQueryDto extends createZodDto(
  z.object({
    search: z.string().min(2),
    type: z.enum(['artist', 'album', 'track']).default('artist'),
  }),
) {}

export const SearchResultsSchema = z.object({
  albums: z.array(AlbumSchemaWithRelations).nullable(),
});

export class SearchResponse extends createZodDto(SearchResultsSchema) {}
