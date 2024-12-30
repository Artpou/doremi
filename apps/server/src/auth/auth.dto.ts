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

export class TokenResponse extends createZodDto(
  z.object({
    token: z.string(),
    refreshToken: z.string(),
    expiresIn: z.number(),
    email: z.string().email(),
  }),
) {}
