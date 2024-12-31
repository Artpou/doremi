"use client";

import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { cn } from "@workspace/ui/lib/utils";
import { useState } from "react";
import ms from "ms";

import { ReviewCard } from "./ReviewCard";

import useAPI from "@/hooks/useAPI";

type FeedType = "trending" | "friends" | "you";

export function Feed({ className }: { className?: string }) {
  const { GET } = useAPI();
  const [feed, setFeed] = useState<FeedType>("trending");

  const { data: reviews } = useQuery({
    queryKey: ["feed", feed],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (feed === "you") {
        // Add user filter when viewing personal reviews
        // params.append("creatorId", currentUserId);
      }
      const { data } = await GET("/reviews");
      return data;
    },
    staleTime: ms("1m"),
  });

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <Tabs value={feed} onValueChange={(value) => setFeed(value as FeedType)}>
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
      <div className="flex flex-col gap-4">
        {reviews?.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
