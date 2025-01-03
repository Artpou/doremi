import { z } from "zod";

export const SearchQuerySchema = z.object({
  search: z.string().min(2),
  type: z.enum(["artist", "album", "track"]).default("artist"),
});
