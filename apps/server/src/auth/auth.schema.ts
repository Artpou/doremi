import { z } from 'zod';

export const TokenResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  expires_in: z.number(),
  email: z.string().email(),
  provider: z.string().optional(),
});

export type TokenResponse = z.infer<typeof TokenResponseSchema>;
