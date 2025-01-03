import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const RefreshSchema = z.object({
  refresh: z.string(),
});

export const SpotifyAuthSchema = z.object({
  email: z.string().email(),
  id: z.string(),
  access_token: z.string(),
  refresh_token: z.string(),
});
