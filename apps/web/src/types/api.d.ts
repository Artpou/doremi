import { paths } from "@workspace/openapi";

// Generic type to get response type for any API endpoint
export type ApiResponse<
  P extends keyof paths,
  M extends keyof paths[P],
> = paths[P][M] extends {
  responses: {
    200: {
      content: {
        "application/json": infer R;
      };
    };
  };
}
  ? R
  : never;

export type IReview = ApiResponse<"/reviews", "get">[0];
export type IAlbum = ApiResponse<"/albums/{id}", "get">;
