import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export class RegisterDto extends createZodDto(
  z.object({
    email: z.string().email(),
    password: z.string(),
  }),
) {}

export class LoginDto extends createZodDto(
  z.object({
    email: z.string().email(),
    password: z.string(),
  }),
) {}

export class RefreshDto extends createZodDto(
  z.object({
    refresh: z.string(),
  }),
) {}

export class SpotifyAuthDto extends createZodDto(
  z.object({
    email: z.string().email(),
    id: z.string(),
    access_token: z.string(),
    refresh_token: z.string(),
  }),
) {}

export class TokenResponse extends createZodDto(
  z.object({
    access_token: z.string(),
    refresh_token: z.string(),
    expires_in: z.number(),
    email: z.string().email(),
    provider: z.string().optional(),
  }),
) {}
