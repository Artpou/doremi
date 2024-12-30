import type { NextAuthConfig, Session } from "next-auth";

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

type CredentialToken = JWT & {
  token: string;
  refreshToken: string;
  expiresIn: number;
};

type JWTSession = Session & {
  accessToken: string;
  refreshToken: string;
};

export const config: NextAuthConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<CredentialToken> {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email as string,
              password: credentials.password as string,
            }),
          },
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to authenticate");
        }

        const data = await response.json();
        return data;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) return { ...token, ...user };

      const credentialToken = token as CredentialToken;
      const isExpired = new Date() > new Date(credentialToken?.expiresIn || 0);

      if (!isExpired) return token;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${credentialToken?.token}`,
          },
          body: JSON.stringify({
            refresh: credentialToken?.refreshToken,
          }),
        },
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return { ...token, ...data };
    },
    async session({ token, session }): Promise<JWTSession> {
      return {
        ...session,
        accessToken: (token as CredentialToken).token,
        refreshToken: (token as CredentialToken).refreshToken,
      };
    },
  },
  pages: {},
} satisfies NextAuthConfig;

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth(config);
