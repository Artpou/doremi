"use client";

import { createContext, useEffect } from "react";
import { getSession } from "next-auth/react";
import { paths } from "@workspace/openapi";
import createClient from "openapi-fetch";

import { authMiddleware, client, Middleware } from "@/lib/api";

export type APIContextType = ReturnType<typeof createClient<paths>>;

export const APIContext = createContext<APIContextType | null>(null);

export function APIProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let middleware: Middleware;

    const setupAuth = async () => {
      middleware = authMiddleware(getSession);
      console.log("🚀 ~ setupAuth ~ middleware:", middleware);
      await client.use(middleware);
    };

    setupAuth();

    return () => {
      client.eject(middleware);
    };
  }, []);

  return <APIContext.Provider value={client}>{children}</APIContext.Provider>;
}
