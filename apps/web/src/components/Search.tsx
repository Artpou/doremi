"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { Input } from "@workspace/ui/components/input";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Loading } from "@workspace/ui/components/loading";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";

import { CardItem } from "./CardItem";

import useAPI from "@/hooks/useAPI";

const DEBOUNCE_TIME = 1000;
const STALE_TIME = 1000 * 60 * 5;

export const Search = () => {
  const t = useTranslations();
  const [search, setSearch] = useState("");
  const [type, setType] = useState<"artist" | "album" | "track">("album");
  const [open, setOpen] = useState(false);
  const debouncedSearch = useDebounce(search, DEBOUNCE_TIME);
  const { GET } = useAPI();
  const containerRef = useRef<HTMLDivElement>(null);

  const shouldShowResults = search.length > 2;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["search", debouncedSearch, type],
    queryFn: async () => {
      if (!debouncedSearch) return {};

      const { data } = await GET("/search", {
        params: {
          query: { search: debouncedSearch, type },
        },
      });

      return data || {};
    },
    enabled: shouldShowResults,
    staleTime: STALE_TIME,
  });

  const items =
    data?.tracks?.items || data?.artists?.items || data?.albums?.items || [];

  return (
    <div className="mx-auto w-full max-w-xl" ref={containerRef}>
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          className="pl-9"
          placeholder="Search artists..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />

        {open && (
          <div className="absolute inset-x-0 top-full z-50 mt-1 gap-2 overflow-hidden rounded-md border bg-popover shadow-md">
            <Tabs
              className="w-full"
              value={type}
              onValueChange={(value) =>
                setType(value as "artist" | "album" | "track")
              }
            >
              <TabsList className="w-full">
                <TabsTrigger className="w-full" value="album">
                  {t("common.albums")}
                </TabsTrigger>
                <TabsTrigger className="w-full" value="track">
                  {t("common.tracks")}
                </TabsTrigger>
                <TabsTrigger className="w-full" value="artist">
                  {t("common.artists")}
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <ScrollArea>
              <div className="max-h-[300px] min-h-32">
                {!shouldShowResults && <></>}
                {shouldShowResults && isLoading && (
                  <div className="flex items-center justify-center gap-2 p-4 text-muted-foreground">
                    <Loading />
                    <span>{t("common.loading")}</span>
                  </div>
                )}
                {shouldShowResults && !isLoading && items?.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">
                    {t("common.no_results")}
                  </div>
                )}
                {shouldShowResults &&
                  !isLoading &&
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  items?.map((item: any) => (
                    <CardItem
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      image={
                        item.images?.[0]?.url || item.album?.images?.[0]?.url
                      }
                      artists={item.artists}
                      release_date={item.release_date}
                    />
                  ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
};
