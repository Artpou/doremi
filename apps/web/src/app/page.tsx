import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { getTranslations } from "next-intl/server";
import { BackgroundBeams } from "@workspace/ui/components/background-beams";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { DiscAlbumIcon, UsersRoundIcon } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@workspace/ui/components/skeleton";

import { auth } from "@/auth";
import { Album } from "@/components/album/album";
import { getAPI } from "@/lib/api";
import { ReviewTabs, SidebarTabs } from "@/components/home/home-tabs";
import {
  ReviewList,
  ReviewListSkeleton,
} from "@/components/review/review-list";
import { ProviderReview } from "@/providers/provider-review";
interface HomeProps {
  searchParams: {
    feed?: "trending" | "friends" | "you";
    sidebar?: "releases" | "following";
  };
}

async function getAlbums({ searchParams }: HomeProps) {
  const sidebarParams = (await searchParams).sidebar ?? "releases";
  const { GET } = getAPI();

  if (sidebarParams === "following") {
    const { data } = await GET("/me/top", {
      next: { revalidate: 60 },
    });
    return data;
  }

  const { data } = await GET("/me/releases", {
    next: { revalidate: 60 },
  });
  return data;
}

export default async function Home({ searchParams }: HomeProps) {
  const session = await auth();
  const t = await getTranslations("common");
  const { GET } = getAPI();
  const feed = (await searchParams).feed ?? "trending";
  const sidebar = (await searchParams).sidebar ?? "releases";

  if (!session) {
    return (
      <section className="flex flex-col items-center justify-center gap-4">
        <div className="flex flex-col gap-4">
          <BackgroundBeams />
          <Button variant="secondary" asChild>
            <Link href="/login">{t("login")}</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">{t("signup")}</Link>
          </Button>
        </div>
      </section>
    );
  }

  const { data: reviews } = await GET("/reviews", {
    params: { query: { feed } },
    next: { revalidate: 60 },
  });
  const albums = await getAlbums({ searchParams });

  return (
    <div className="flex size-full gap-4">
      <div className="flex size-full flex-col gap-2">
        <ReviewTabs />
        <ScrollArea className="h-full min-h-0 flex-1">
          <Suspense fallback={ReviewListSkeleton}>
            <ReviewList items={reviews || []} />
          </Suspense>
        </ScrollArea>
      </div>
      <div className="hidden size-full max-w-60 flex-col gap-2 sm:flex md:max-w-80 xl:max-w-96">
        <SidebarTabs />
        <Card className="mb-1 flex min-h-0 flex-1 flex-col">
          <CardHeader className="flex-none">
            <CardTitle className="flex items-center gap-2">
              <DiscAlbumIcon className="size-4" />
              <span>
                {sidebar === "releases" ? "Latest Releases" : "Your favorites"}
              </span>
            </CardTitle>
          </CardHeader>
          <ScrollArea className="min-h-0 flex-1">
            <CardContent className="flex flex-col gap-2">
              <ProviderReview layoutId="sidebar">
                <Suspense
                  fallback={Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12" />
                  ))}
                >
                  {albums?.map((item) => (
                    <Album
                      key={item.id}
                      album={item}
                      layoutId="sidebar"
                      isSmall
                    />
                  ))}
                </Suspense>
              </ProviderReview>
            </CardContent>
          </ScrollArea>
        </Card>
        <Card className="mt-1 flex min-h-0 flex-1 flex-col">
          <CardHeader className="flex-none">
            <CardTitle className="flex items-center gap-2">
              <UsersRoundIcon className="size-4" />
              <span>Friends</span>
            </CardTitle>
          </CardHeader>
          <ScrollArea className="min-h-0 flex-1">
            <CardContent className="flex flex-col gap-2">
              <Suspense
                fallback={Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
              ></Suspense>
            </CardContent>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
