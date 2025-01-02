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
import ms from "ms";

import { Album } from "./album/album";

import useAPI from "@/hooks/useAPI";

const DEBOUNCE_TIME = ms("1s");
const STALE_TIME = ms("1m");

export const Search = () => {
  const t = useTranslations();
  const [search, setSearch] = useState("");
  const [type, setType] = useState<"artist" | "album" | "track">("album");
  const [open, setOpen] = useState(false);
  const debouncedSearch = useDebounce(search, DEBOUNCE_TIME);
  const { GET } = useAPI();
  const containerRef = useRef<HTMLDivElement>(null);

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
      const { data } = await GET("/search", {
        params: {
          query: { search: debouncedSearch, type },
        },
      });

      return data;
    },
    enabled: search.length > 2 && !!debouncedSearch,
    staleTime: STALE_TIME,
  });

  const shouldShowResults =
    search.length > 2 && !isLoading && !!debouncedSearch;

  const items = data?.albums || [];

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
          <div className="fixed inset-x-0 z-50 mt-2 items-center gap-2 overflow-hidden rounded-md border bg-popover shadow-md sm:absolute sm:top-full sm:mt-1">
            <Tabs
              className="relative w-full"
              value={type}
              onValueChange={(value) =>
                setType(value as "artist" | "album" | "track")
              }
            >
              <TabsList className="w-full rounded-none">
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
              <div className="max-h-[320px] sm:min-h-32">
                {isLoading && (
                  <div className="flex h-full items-center justify-center gap-2 p-4 text-muted-foreground sm:min-h-32">
                    <Loading />
                    <span>{t("common.loading")}</span>
                  </div>
                )}
                {shouldShowResults && items?.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">
                    {t("common.no_results")}
                  </div>
                )}
                <div className="flex flex-col gap-2 p-2">
                  {shouldShowResults &&
                    items?.length > 0 &&
                    items?.map((item, idx) => (
                      <Album key={idx} album={item} isSmall />
                    ))}
                </div>
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
};
