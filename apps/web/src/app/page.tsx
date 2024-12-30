import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { getTranslations } from "next-intl/server";
import { BackgroundBeams } from "@workspace/ui/components/background-beams";

import { auth } from "@/auth";
import { GET } from "@/app/api/client";
import { CarouselItem } from "@/components/CarouselItem";

export default async function Home() {
  const session = await auth();
  const t = await getTranslations("common");
  const { data: releases } = await GET("/search/releases");
  const { data: top } = await GET("/user/top");

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

  return (
    <div className="flex w-full gap-4 self-center">
      <div className="flex w-full items-center justify-center rounded-lg bg-sidebar sm:w-2/3 lg:w-3/4 xl:w-4/5">
        <span>WIP FEED</span>
      </div>
      <div className="hidden flex-col sm:flex sm:w-1/3 lg:w-1/4 xl:w-1/5">
        <h2 className="text-2xl font-bold">New Releases</h2>
        <CarouselItem
          items={
            releases
              ? releases.albums.items.slice(0, 8).map((item) => ({
                  imageUrl: item.images[0]?.url || "",
                  title: item.name,
                  artists: item.artists?.map((artist) => artist.name),
                }))
              : []
          }
        />
        <h2 className="mt-2 text-2xl font-bold">Top Tracks</h2>
        <CarouselItem
          items={
            top
              ? top.items.slice(0, 8).map((item) => ({
                  imageUrl: item.album.images[0]?.url || "",
                  title: item.name,
                  artists: item.artists?.map((artist) => artist.name),
                }))
              : []
          }
        />
      </div>
    </div>
  );
}
