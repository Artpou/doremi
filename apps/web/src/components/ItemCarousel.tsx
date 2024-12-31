"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

const ONE_SECOND = 1000;
const AUTO_DELAY = ONE_SECOND * 8;
const DRAG_BUFFER = 50;

const SPRING_OPTIONS = {
  type: "spring",
  mass: 3,
  stiffness: 400,
  damping: 50,
};

interface CarouselItemData {
  imageUrl: string;
  title: string;
  artists?: string[];
}

const Images = ({
  imgIndex,
  items,
}: {
  imgIndex: number;
  items: CarouselItemData[];
}) => {
  return (
    <>
      {items.map(({ imageUrl, title, artists }, idx) => {
        return (
          <motion.div
            key={idx}
            className="relative aspect-square size-full shrink-0"
          >
            <motion.div
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              animate={{
                scale: imgIndex === idx ? 0.95 : 0.85,
              }}
              transition={SPRING_OPTIONS}
              className="size-full rounded-xl bg-neutral-800 object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 text-center">
              <p className="font-medium drop-shadow-lg">{title}</p>
              {artists && <p className="mt-1 text-sm">{artists.join(", ")}</p>}
            </div>
          </motion.div>
        );
      })}
    </>
  );
};

const Dots = ({
  imgIndex,
  setImgIndex,
  items,
}: {
  imgIndex: number;
  setImgIndex: Dispatch<SetStateAction<number>>;
  items: CarouselItemData[];
}) => {
  return (
    <div className="mt-4 flex w-full justify-center gap-2">
      {items.map((_, idx) => {
        return (
          <button
            key={idx}
            onClick={() => setImgIndex(idx)}
            className={`size-3 rounded-full transition-colors ${
              idx === imgIndex ? "bg-neutral-50" : "bg-neutral-500"
            }`}
          />
        );
      })}
    </div>
  );
};

const GradientEdges = () => {
  return (
    <>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[10vw] max-w-[100px] bg-gradient-to-r from-neutral-950/50 to-neutral-950/0" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[10vw] max-w-[100px] bg-gradient-to-l from-neutral-950/50 to-neutral-950/0" />
    </>
  );
};

export const ItemCarousel = ({ items }: { items: CarouselItemData[] }) => {
  const [imgIndex, setImgIndex] = useState(0);
  const dragX = useMotionValue(0);

  useEffect(() => {
    const intervalRef = setInterval(() => {
      const x = dragX.get();

      if (x === 0) {
        setImgIndex((pv) => {
          if (pv === items.length - 1) {
            return 0;
          }
          return pv + 1;
        });
      }
    }, AUTO_DELAY);

    return () => clearInterval(intervalRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDragEnd = () => {
    const x = dragX.get();

    if (x <= -DRAG_BUFFER && imgIndex < items.length - 1) {
      setImgIndex((pv) => pv + 1);
    } else if (x >= DRAG_BUFFER && imgIndex > 0) {
      setImgIndex((pv) => pv - 1);
    }
  };

  return (
    <div className="relative size-full overflow-hidden bg-neutral-950 py-0">
      <motion.div
        drag="x"
        dragConstraints={{
          left: 0,
          right: 0,
        }}
        style={{
          x: dragX,
        }}
        animate={{
          translateX: `-${imgIndex * 100}%`,
        }}
        transition={SPRING_OPTIONS}
        onDragEnd={onDragEnd}
        className="flex cursor-grab items-center active:cursor-grabbing"
      >
        <Images imgIndex={imgIndex} items={items} />
      </motion.div>
      <Dots imgIndex={imgIndex} setImgIndex={setImgIndex} items={items} />
      <GradientEdges />
    </div>
  );
};
