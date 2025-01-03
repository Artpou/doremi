import { cn } from "@workspace/ui/lib/utils";
import { Star, Volume2Icon, VolumeIcon } from "lucide-react";
import React, { HTMLAttributes } from "react";
import { Slider } from "@workspace/ui/components/slider";
import { Button } from "@workspace/ui/components/button";

interface ReviewStarsProps extends HTMLAttributes<HTMLDivElement> {
  note: number | null;
  onValueChange?: (value: number) => void;
}

export const ReviewStars = ({
  note,
  className,
  onValueChange,
  ...props
}: ReviewStarsProps) => {
  const starNote = note !== null ? note / 2 : null;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 w-full items-center",
        !note && "opacity-50",
        className,
      )}
      {...props}
    >
      <div className={cn("flex items-center gap-0.5")}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="relative">
            <Star
              className={cn(
                "relative",
                !onValueChange ? "size-5" : "size-8",
                "text-gray-300",
              )}
            />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                width:
                  starNote && starNote >= i + 1
                    ? "100%"
                    : starNote && starNote > i
                      ? `${(starNote - i) * 100}%`
                      : "0%",
              }}
            >
              <Star
                className={cn(
                  "text-primary fill-primary",
                  !onValueChange ? "size-5" : "size-8",
                )}
              />
            </div>
          </div>
        ))}
      </div>

      {onValueChange && (
        <div className="flex w-full items-center gap-2 sm:px-2">
          <Button
            variant="outline"
            disabled={note !== null && note <= 0}
            onClick={() => (note || 1) > 0 && onValueChange((note || 1) - 1)}
          >
            <VolumeIcon className="size-5" />
          </Button>
          <Slider
            value={[note || 0]}
            min={0}
            max={10}
            step={1}
            className="w-full"
            onValueChange={(value) => onValueChange(Number(value[0]))}
          />
          <Button
            variant="outline"
            disabled={note !== null && note >= 10}
            onClick={() => (note || 0) < 10 && onValueChange((note || 0) + 1)}
          >
            <Volume2Icon className="size-5" />
          </Button>
        </div>
      )}
    </div>
  );
};
