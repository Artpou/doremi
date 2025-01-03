import { z } from "zod";

export const ListReviewsSchema = z.object({
  creatorId: z.number().optional(),
  albumId: z.number().optional(),
  trackId: z.number().optional(),
});

export const CreateReviewSchema = z.object({
  albumId: z.number(),
  note: z.number().min(0).max(10),
  comment: z.string().optional(),
});
