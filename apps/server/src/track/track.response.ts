import { createSelectSchema } from 'drizzle-zod';
import { tracks } from 'db/schema';
import { createZodDto } from 'nestjs-zod';

export const TrackSchema = createSelectSchema(tracks);
export class TrackResponse extends createZodDto(TrackSchema) {}
