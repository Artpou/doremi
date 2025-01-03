import { createZodDto } from 'nestjs-zod';
import { AlbumSchemaWithRelations } from 'src/album/album.response';
import { z } from 'zod';

export const SearchResultsSchema = z.object({
  albums: z.array(AlbumSchemaWithRelations).nullable(),
});

export class SearchResponse extends createZodDto(SearchResultsSchema) {}
