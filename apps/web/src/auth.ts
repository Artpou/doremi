import type { NextAuthConfig, Session } from "next-auth";

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import Spotify from "next-auth/providers/spotify";
import createClient from "openapi-fetch";
import { paths } from "@workspace/openapi";

const client = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
});

type CredentialToken = JWT & {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  provider?: string;
};

type JWTSession = Session & {
  access_token: string;
  refresh_token: string;
};

let isRefreshing = false;

export const config: NextAuthConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<CredentialToken> {
        const { data, error } = await client.POST("/auth/login", {
          body: {
            email: credentials.email as string,
            password: credentials.password as string,
          },
        });

        if (error) {
          throw new Error(error || "Failed to authenticate");
        }

        return data;
      },
    }),
    Spotify({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        url: "https://accounts.spotify.com/authorize",
        params: {
          scope: "user-read-email user-read-private user-top-read",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile, user }) {
      if (!profile || !account || account.provider !== "spotify") return true;

      const { error, data } = await client.POST("/auth/spotify", {
        body: {
          email: profile.email as string,
          id: profile.uri as string,
          access_token: account.access_token as string,
          refresh_token: account.refresh_token as string,
        },
      });

      if (error) {
        return false;
      }

      user.email = data.email;
      // @ts-expect-error inject access_token
      user.access_token = data.access_token;
      // @ts-expect-error inject refresh_token
      user.refresh_token = data.refresh_token;
      // @ts-expect-error inject expires_in
      user.expires_in = data.expires_in;
      // @ts-expect-error inject provider
      user.provider = data.provider;

      return true;
    },
    async jwt({ token, user }) {
      if (user) return { ...token, ...user };

      if (isRefreshing) return token;

      const credentialToken = token as CredentialToken;
      if (!credentialToken?.expires_in) return null;

      const isExpired = Date.now() > credentialToken.expires_in;
      if (!isExpired) return token;

      isRefreshing = true;

      const { data, error } = await client.POST("/auth/refresh", {
        body: {
          refresh: credentialToken?.refresh_token,
        },
      });

      isRefreshing = false;

      if (error) return null;

      return { ...token, ...data };
    },
    async session({ token, session }): Promise<JWTSession> {
      return {
        ...session,
        access_token: token.access_token as string,
        refresh_token: token.refresh_token as string,
      };
    },
  },
  pages: {
    signIn: "/login",
    newUser: "/signup",
    error: "/",
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
} satisfies NextAuthConfig;

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth(config);
