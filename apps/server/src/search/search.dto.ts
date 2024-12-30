import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { SearchResultsSchema } from 'src/spotify/spotify.dto';

export class SearchQueryDto extends createZodDto(
  z.object({
    search: z.string().min(2),
    type: z.enum(['artist', 'album', 'track']).default('artist'),
  }),
) {}

export class SearchResponse extends createZodDto(SearchResultsSchema) {}
