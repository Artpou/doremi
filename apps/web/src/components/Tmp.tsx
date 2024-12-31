import type { ApiResponse } from "@/types/api";

import { EditIcon, HeartIcon, PlayIcon, Star, StarIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";
import Link from "next/link";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";

interface ReviewCardProps {
  review: ApiResponse<"/reviews", "get">[0];
}

export function ReviewCard({ review }: ReviewCardProps) {
  const initials = review.creator?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="group relative">
      <div className="absolute right-0 top-0 hidden flex-col gap-2 p-4 group-hover:flex">
        <Button className="size-10 rounded-full px-0">
          <PlayIcon />
        </Button>
      </div>
      <CardHeader className="gap-4 space-y-0">
        <div className="flex items-center gap-2">
          <Avatar className="size-6">
            <AvatarImage src={undefined} alt={review.creator?.name || ""} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="mr-2 font-medium">{review.creator?.name}</span>
          <Button variant="secondary" size="sm" className="text-xs">
            Follow
          </Button>
        </div>
        <div className="flex gap-4">
          {review.album?.image && (
            <Image
              src={review.album.image}
              alt={review.album.title}
              width={80}
              height={80}
              className="mx-1 cursor-pointer rounded-md object-cover transition-all hover:ring-2 hover:ring-primary"
            />
          )}
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold hover:underline">
              <Link href={`/album/${review.album?.id}`}>
                {review.album?.title}
              </Link>
            </h3>
            <span className="text-sm text-muted-foreground">
              {review.album?.artists?.map(({ artist }, index) => (
                <span key={artist.id}>
                  <Link
                    className="text-primary hover:underline"
                    href={`/artist/${artist.id}`}
                  >
                    {artist.name}
                  </Link>
                  {index < (review.album?.artists?.length || 0) - 1 && ", "}
                </span>
              ))}
            </span>
            <span className="text-sm text-muted-foreground">
              {review.album?.releaseYear}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "size-4",
                  i < review.note
                    ? "fill-primary text-primary"
                    : "fill-muted text-muted",
                )}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {!!review.createdAt &&
              new Date(review.createdAt as string).toLocaleDateString()}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{review.comment}</p>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-4 text-muted-foreground">
        <Button variant="ghost" size="sm" className="text-xs">
          <HeartIcon />
          Liker cet review
        </Button>
        {(review?.album?.releaseYear || 0) < 2015 ? (
          <Button variant="ghost" size="sm" className="text-xs">
            <StarIcon />
            Noter cet album
          </Button>
        ) : (
          <Button variant="ghost" size="sm" className="gap-2 text-xs">
            <EditIcon />
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "size-4",
                    i < review.note
                      ? "fill-primary text-primary"
                      : "fill-muted text-muted",
                  )}
                />
              ))}
            </div>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
