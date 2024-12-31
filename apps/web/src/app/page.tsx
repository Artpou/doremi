import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { getTranslations } from "next-intl/server";
import { BackgroundBeams } from "@workspace/ui/components/background-beams";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

import { auth } from "@/auth";
import { GET } from "@/app/api/client";
import { ItemCarousel } from "@/components/ItemCarousel";
import { Feed } from "@/components/Feed";
import { ItemCard } from "@/components/ItemCard";

export default async function Home() {
  const session = await auth();
  const t = await getTranslations("common");

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

  const { data: releases } = await GET("/me/releases");
  const { data: top } = await GET("/me/top");

  return (
    <div className="flex size-full gap-4 self-center">
      <div className="flex flex-col gap-2 sm:w-2/3 xl:w-3/4">
        <Feed className="h-full" />
      </div>
      <div className="hidden flex-col sm:flex sm:w-1/3 xl:w-1/4 gap-4">
        <ItemCarousel
          items={(releases || []).slice(0, 8).map((item) => ({
            imageUrl: item.image || "",
            title: item.title || "",
            artists: item.artists?.map((artist) => artist.artist.name),
          }))}
        />
        <ScrollArea className="max-h-[300px] rounded-md border-border bg-card">
          {(releases || []).map((item, idx) => (
            <ItemCard
              key={idx}
              id={idx}
              name={item.title}
              image={item.image || ""}
              artists={item.artists?.map(({ artist }) => artist)}
              release_date={item.releaseYear}
            />
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}
