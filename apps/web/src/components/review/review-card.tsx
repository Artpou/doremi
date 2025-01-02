"use client";

import type { IReview } from "@/types/api";

import {
  EditIcon,
  ThumbsUp,
  UserRoundMinusIcon,
  UserRoundPlusIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@workspace/ui/components/card";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";

import { Album } from "../album/album";

import { ReviewStars } from "./review-stars";

import { useReviewStore } from "@/store/useReviewStore";

interface ReviewCardProps {
  review: IReview;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  const { setSelectedAlbum } = useReviewStore();
  const { creator, note, album, comment } = review;

  return (
    <Card className="group relative transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="size-10">
            <AvatarImage alt={creator.name || ""} />
            <AvatarFallback>{creator.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-medium">{creator.name}</span>
              {/* eslint-disable-next-line no-constant-condition */}
              {true ? (
                <Badge
                  variant="secondary"
                  className="flex cursor-pointer gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                >
                  <UserRoundPlusIcon className="size-4" />
                  <span>follow</span>
                </Badge>
              ) : (
                <Badge
                  variant="destructive"
                  className="flex cursor-pointer gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                >
                  <UserRoundMinusIcon className="size-4" />
                  <span>unfollow</span>
                </Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              @{creator.name}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Album album={album!} layoutId="review" />
      </CardContent>
      <CardFooter className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ReviewStars note={note} />
              <Button className="flex gap-2" size="sm">
                <ThumbsUp />
                <span className="mt-0.5">0</span>
              </Button>
            </div>
            {album!.id % 2 === 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedAlbum(album, "review")}
              >
                <span>Your note</span>
                <ReviewStars note={3} />
                <EditIcon />
              </Button>
            )}
          </div>
          <p className="text-muted-foreground">{comment}</p>
        </div>
      </CardFooter>
    </Card>
  );
};
