"use client";

import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { parseAsString, useQueryState } from "nuqs";

export const ReviewTabs = () => {
  const [feed, setFeed] = useQueryState(
    "feed",
    parseAsString.withOptions({ shallow: false }).withDefault("trending"),
  );

  return (
    <Tabs value={feed} onValueChange={setFeed}>
      <TabsList className="w-full rounded-none sm:w-auto sm:rounded-md">
        <TabsTrigger className="w-full" value="trending">
          Trending
        </TabsTrigger>
        <TabsTrigger className="w-full" value="friends">
          Friends
        </TabsTrigger>
        <TabsTrigger className="w-full" value="you">
          You
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export const SidebarTabs = () => {
  const [feed, setFeed] = useQueryState(
    "sidebar",
    parseAsString.withOptions({ shallow: false }).withDefault("trending"),
  );

  return (
    <Tabs value={feed} onValueChange={setFeed}>
      <TabsList className="w-full rounded-none sm:w-auto sm:rounded-md">
        <TabsTrigger className="w-full" value="trending">
          Trending
        </TabsTrigger>
        <TabsTrigger className="w-full" value="following">
          Following
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
