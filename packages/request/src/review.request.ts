import { z } from "zod";

export const ListReviewsQuerySchema = z.object({
  feed: z.enum(["trending", "friends", "you"]),
});
export type ListReviewsQuery = z.infer<typeof ListReviewsQuerySchema>;

export const CreateReviewSchema = z.object({
  albumId: z.number(),
  note: z.number().min(0).max(10),
  comment: z.string().optional(),
});
export type CreateReviewBody = z.infer<typeof CreateReviewSchema>;
