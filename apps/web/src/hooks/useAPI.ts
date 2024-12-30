"use client";
import { useEffect } from "react";
import { getSession } from "next-auth/react";

import { authMiddleware, client, Middleware } from "@/app/api";

const useAPI = () => {
  useEffect(() => {
    let middleware: Middleware;

    const setupAuth = async () => {
      middleware = authMiddleware(getSession);
      client.use(middleware);
    };

    setupAuth();

    return () => {
      client.eject(middleware);
    };
  }, []);

  return client;
};

export default useAPI;
