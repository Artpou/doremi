"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CreateReviewSchema } from "@workspace/request/review.request";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@workspace/ui/components/card";
import { Textarea } from "@workspace/ui/components/textarea";

import { AlbumDetails, AlbumImage } from "@/components/album/album";
import useAPI from "@/hooks/useAPI";
import { useReviewStore } from "@/store/useReviewStore";
import { IAlbum, IReview } from "@/types/api";

import { ReviewStars } from "./review-stars";

export type CreateReview = z.infer<typeof CreateReviewSchema>;

interface ReviewEditProps {
  layoutId: string;
  album: IAlbum;
  review: IReview | null;
}

export function ReviewEdit({ layoutId, album, review }: ReviewEditProps) {
  const { PUT, POST } = useAPI();
  const t = useTranslations();
  const { setSelectedAlbum } = useReviewStore();
  const { register, watch, setValue, handleSubmit } = useForm<CreateReview>({
    resolver: zodResolver(CreateReviewSchema),
    mode: "onChange",
    defaultValues: {
      albumId: album.id,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (body: CreateReview) => {
      const { data, error } = review
        ? await PUT("/reviews/{id}", {
            params: { path: { id: review.id } },
            body,
          })
        : await POST("/reviews", {
            body,
          });
      if (error) throw new Error();

      return data;
    },
    onSuccess: () => setSelectedAlbum(null),
    onError: () => {
      // toast.error("Erreur lors de la création de la critique");
    },
  });

  const onSubmit = (data: CreateReview) => mutate(data);

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader className="flex flex-row gap-4">
          <AlbumImage album={album} layoutId={`${layoutId}-${album.id}`} />
          <AlbumDetails album={album} layoutId={`${layoutId}-${album.id}`} />
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <ReviewStars
            note={watch("note")}
            onValueChange={(note) => setValue("note", note)}
          />
          <Textarea
            className="text-sm"
            placeholder="Commentaire"
            {...register("comment")}
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" isLoading={isPending} disabled={!watch("note")}>
            Enregistrer
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
