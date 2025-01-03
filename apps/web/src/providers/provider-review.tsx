"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useClickAway } from "@uidotdev/usehooks";

import { ReviewEdit } from "@/components/review/review-edit";
import { useReviewStore } from "@/store/useReviewStore";

interface ReviewListProps {
  children: React.ReactNode;
  layoutId: string;
}

export function ProviderReview({ children, layoutId }: ReviewListProps) {
  const {
    review,
    selectedAlbum,
    layoutId: layoutIdStore,
    setSelectedAlbum,
  } = useReviewStore();

  const ref = useClickAway<HTMLDivElement>(() => setSelectedAlbum(null));

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedAlbum(null);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedAlbum, setSelectedAlbum]);

  return (
    <>
      <AnimatePresence>
        {selectedAlbum && layoutIdStore === layoutId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-10 size-full bg-black/50"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedAlbum && layoutIdStore === layoutId && (
          <div className="fixed inset-0 z-[100] grid place-items-center">
            <div ref={ref} className="w-full max-w-lg">
              <motion.div layoutId={`${layoutId}-${selectedAlbum.id}`}>
                <ReviewEdit
                  layoutId={layoutId}
                  album={selectedAlbum}
                  review={review}
                />
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
