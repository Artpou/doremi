import createClient, { Middleware } from "openapi-fetch";
import { paths } from "@workspace/openapi";
import { Session } from "next-auth";

export type { Middleware };

export const authMiddleware = (
  getSession: () => Promise<Session | null>,
): Middleware => ({
  async onRequest({ request }) {
    const session = await getSession();

    if (session) {
      // @ts-expect-error session is not typed
      request.headers.set("Authorization", `Bearer ${session.access_token}`);
    }
  },
});

export const client = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
});
