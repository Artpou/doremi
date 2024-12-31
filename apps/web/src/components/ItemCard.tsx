"use client";

import { Play, Star } from "lucide-react";
import Image from "next/image";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

interface SearchResultItemProps {
  id: number;
  name: string;
  image?: string;
  artists?: {
    id: number;
    name: string;
  }[];
  release_date: number | null;
}

export const ItemCard = ({
  id,
  name,
  image,
  artists,
  release_date,
}: SearchResultItemProps) => {
  const year = release_date
    ? new Date(release_date).getFullYear().toString()
    : null;

  return (
    <div
      key={id}
      className="flex cursor-pointer items-center justify-between gap-4 rounded-sm p-4 hover:bg-accent"
    >
      <div className="flex items-center gap-4">
        {!!image && (
          <Image
            src={image}
            alt={name}
            className="rounded-sm object-cover"
            height={48}
            width={48}
          />
        )}
        <div>
          <h3 className="line-clamp-2 font-medium">{name}</h3>
          <span className="text-sm text-muted-foreground">
            {artists?.map((artist, index) => (
              <span key={artist.id}>
                <Link
                  className="text-primary hover:underline"
                  href={`/artist/${artist.id}`}
                >
                  {artist.name}
                </Link>
                {index < artists.length - 1 && ", "}
              </span>
            ))}
            {year && ` - ${year}`}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button size="icon" variant="outline">
          <Star />
        </Button>
        <Button size="icon">
          <Play />
        </Button>
      </div>
    </div>
  );
};
