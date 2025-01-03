import { createSelectSchema } from 'drizzle-zod';
import { albums } from 'db/schema';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ArtistSchema } from 'src/artist/artist.response';

export const AlbumSchema = createSelectSchema(albums);
export class AlbumResponse extends createZodDto(AlbumSchema) {}

export const AlbumSchemaWithRelations = AlbumSchema.extend({
  artists: z.array(z.object({ artist: ArtistSchema })),
});
export class AlbumWithRelationsResponse extends createZodDto(
  AlbumSchemaWithRelations,
) {}
