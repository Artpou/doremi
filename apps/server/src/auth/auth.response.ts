import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export class TokenResponse extends createZodDto(
  z.object({
    access_token: z.string(),
    refresh_token: z.string(),
    expires_in: z.number(),
    email: z.string().email(),
    provider: z.string().optional(),
  }),
) {}
