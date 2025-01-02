"use client";

import { Textarea } from "@workspace/ui/components/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

import { ReviewStars } from "./review-stars";

import { AlbumDetails, AlbumImage } from "@/components/album/album";
import { IAlbum as AlbumType } from "@/types/api";

interface ReviewEditProps {
  layoutId: string;
  album: AlbumType;
}

export function ReviewEdit({ layoutId, album }: ReviewEditProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row gap-4">
        <AlbumImage album={album} layoutId={`${layoutId}-${album.id}`} />
        <AlbumDetails album={album} layoutId={`${layoutId}-${album.id}`} />
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <ReviewStars note={3} />
        <Textarea className="text-sm" placeholder="Commentaire" />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button>Enregistrer</Button>
      </CardFooter>
    </Card>
  );
}
