import { createSelectSchema } from 'drizzle-zod';
import { artists } from 'db/schema';
import { createZodDto } from 'nestjs-zod';

export const ArtistSchema = createSelectSchema(artists);
export class ArtistResponse extends createZodDto(ArtistSchema) {}
