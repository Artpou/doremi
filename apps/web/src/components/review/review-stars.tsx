import { Star } from "lucide-react";
import React from "react";

interface ReviewStarsProps {
  note: number;
}

export const ReviewStars = ({ note }: ReviewStarsProps) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`size-5 ${
          i < note ? "fill-primary text-primary" : "text-gray-300"
        }`}
      />
    ))}
  </div>
);
