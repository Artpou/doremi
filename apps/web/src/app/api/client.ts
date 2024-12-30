import { client, authMiddleware } from ".";

import { auth } from "@/auth";

client.use(authMiddleware(auth));

export const { GET, POST } = client;
