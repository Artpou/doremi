import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});
export type RegisterBody = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type LoginBody = z.infer<typeof LoginSchema>;

export const RefreshSchema = z.object({
  refresh: z.string(),
});
export type RefreshBody = z.infer<typeof RefreshSchema>;

export const SpotifyAuthSchema = z.object({
  email: z.string().email(),
  id: z.string(),
  access_token: z.string(),
  refresh_token: z.string(),
});
export type SpotifyAuthBody = z.infer<typeof SpotifyAuthSchema>;
