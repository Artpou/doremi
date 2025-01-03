import { Skeleton } from "@workspace/ui/components/skeleton";

import { ReviewCard } from "./review-card";

import { IReview } from "@/types/api";
import { ProviderReview } from "@/providers/provider-review";

export const ReviewListSkeleton = Array.from({ length: 5 }).map((_, i) => (
  <Skeleton key={i} className="h-60" />
));

interface ReviewListProps {
  items: IReview[];
}

export function ReviewList({ items }: ReviewListProps) {
  return (
    <ProviderReview layoutId="review">
      <div className="flex size-full flex-col sm:gap-4">
        {items.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </ProviderReview>
  );
}
