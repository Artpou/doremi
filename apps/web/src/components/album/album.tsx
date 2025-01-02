"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { motion } from "framer-motion";
import { PlayIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useReviewStore } from "@/store/useReviewStore";
import { IAlbum } from "@/types/api";

interface AlbumProps {
  className?: string;
  album: IAlbum;
  isSmall?: boolean;
  layoutId?: string;
}

export const Album = ({
  className,
  album,
  isSmall = false,
  layoutId,
}: AlbumProps) => {
  const { selectedAlbum, setSelectedAlbum } = useReviewStore();
  const layoutCustomId = layoutId ? `${layoutId}-${album.id}` : undefined;

  return (
    <motion.div
      layoutId={layoutCustomId}
      className={cn("relative group w-full flex gap-4", className)}
    >
      {!selectedAlbum && (
        <Button
          variant="secondary"
          className={cn(
            "z-10 absolute transition-opacity duration-200 opacity-0 group-hover:opacity-100 right-4 top-1/2 -translate-y-1/2 rounded-full",
            isSmall && "size-8",
          )}
          onClick={() => setSelectedAlbum(album, layoutId)}
        >
          <StarIcon />
          {!isSmall && <span>Noter</span>}
        </Button>
      )}
      {!!album.image && (
        <AlbumImage album={album} isSmall={isSmall} layoutId={layoutCustomId} />
      )}
      <AlbumDetails album={album} isSmall={isSmall} layoutId={layoutCustomId} />
    </motion.div>
  );
};

export const AlbumImage = ({
  album,
  isSmall = false,
  layoutId,
}: AlbumProps) => (
  <div className="flex items-center justify-center">
    <motion.div
      layoutId={layoutId ? `image-${layoutId}` : undefined}
      className={cn("relative", isSmall ? "size-[48px]" : "size-[80px]")}
    >
      <Image
        src={album.image!}
        alt={`${album.title} cover`}
        width={isSmall ? 48 : 80}
        height={isSmall ? 48 : 80}
        className={cn(
          "aspect-square cursor-pointer rounded-md object-contain",
          isSmall ? "size-[48px]" : "size-[80px]",
        )}
      />
      <Button
        className={cn(
          "absolute opacity-0 transition-opacity duration-200 group-hover:opacity-100 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex-col rounded-full",
          isSmall ? "size-8" : "size-10",
        )}
      >
        <PlayIcon />
      </Button>
    </motion.div>
  </div>
);

export const AlbumDetails = ({
  album,
  isSmall = false,
  layoutId,
}: AlbumProps) => (
  <motion.div
    layoutId={layoutId ? `details-${layoutId}` : undefined}
    className={cn("flex flex-col", isSmall ? "gap-0.5" : "gap-1")}
  >
    <Link href={`/album/${album.id}`}>
      <h2
        className={cn(
          "hover:underline",
          isSmall ? "font-medium line-clamp-2" : "font-bold text-xl",
        )}
      >
        {album.title}
      </h2>
    </Link>
    <div>
      {album?.artists?.map(({ artist }, index) => (
        <span key={artist.id}>
          <Link
            className="text-primary hover:underline"
            href={`/artist/${artist.id}`}
          >
            {artist.name}
          </Link>
          {index < (album?.artists?.length || 0) - 1 && ", "}
        </span>
      ))}
      {!isSmall && (
        <span className="text-muted-foreground">
          {album.releaseYear && ` - ${album.releaseYear}`}
        </span>
      )}
    </div>
    {!isSmall && (
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">Rap</Badge>
        <Badge variant="secondary">Techno</Badge>
      </div>
    )}
  </motion.div>
);
