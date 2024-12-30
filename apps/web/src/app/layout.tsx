import "@repo/ui/globals.css";

import { Metadata, Viewport } from "next";
import { SessionProvider } from "next-auth/react";
import { cn } from "@repo/ui/lib/cn";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { auth } from "@/auth";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <SessionProvider session={session} refetchOnWindowFocus={false}>
          <ReactQueryProvider>
            <div className="relative flex h-screen flex-col">
              <main className="container mx-auto max-w-7xl grow px-6 pt-16">
                {children}
              </main>
              <footer className="flex w-full items-center justify-center gap-1 py-3">
                <span>Powered by</span>
                <p className="text-primary">DaisyUI</p>
              </footer>
            </div>
          </ReactQueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
