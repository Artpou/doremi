import type { ApiResponse } from "@/types/api";

import { Music, PlayIcon, Star, StarIcon, ThumbsUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@workspace/ui/components/card";
import Image from "next/image";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

interface ReviewCardProps {
  review: ApiResponse<"/reviews", "get">[0];
}

export function ReviewCard({ review }: ReviewCardProps) {
  const author = review.creator!;
  const album = review.album!;
  const rating = review.note!;
  const comment = review.comment!;

  return (
    <Card className="group relative">
      <div className="absolute right-0 top-0 hidden flex-col gap-2 p-4 group-hover:flex">
        <Button className="size-10 rounded-full px-0">
          <PlayIcon />
        </Button>
      </div>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="size-10">
            <AvatarImage alt={author.name || ""} />
            <AvatarFallback>{author?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{author.name}</p>
            <p className="text-xs text-muted-foreground">Reviewer</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex gap-4">
          <Image
            src={album.image ?? ""}
            alt={`${album.title} cover`}
            width={80}
            height={80}
            className="cursor-pointer rounded-md object-cover transition-all hover:ring-2 hover:ring-primary"
          />
          <div className="flex flex-col gap-0.5">
            <Link href={`/album/${album.id}`}>
              <h2 className="text-xl font-bold hover:underline">
                {album.title}
              </h2>
            </Link>
            <span>
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
            <p className="text-sm text-muted-foreground">
              Released: {album.releaseYear}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`size-5 ${
                  i < review.note
                    ? "fill-primary text-primary"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-muted-foreground">{review.comment}</p>
        </div>
      </CardContent>
      <CardFooter className="grid w-full grid-cols-2 gap-4 text-muted-foreground">
        <Button variant="ghost">
          <ThumbsUp className="mr-2 size-4" />
          Like Review
        </Button>
        <Button variant="ghost">
          <StarIcon className="mr-2 size-4" />
          Rate Album
        </Button>
      </CardFooter>
    </Card>
  );
}
