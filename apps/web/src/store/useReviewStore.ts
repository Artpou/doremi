import { create } from "zustand";

import { IAlbum, IReview } from "@/types/api";

interface ReviewStore {
  review: IReview | null;
  selectedAlbum: IAlbum | null;
  layoutId: string;
  setReview: (review: IReview | null) => void;
  setSelectedAlbum: (album: IAlbum | null, layoutId?: string) => void;
}

export const useReviewStore = create<ReviewStore>((set) => ({
  review: null,
  selectedAlbum: null,
  layoutId: "",
  setReview: (review) => set({ review }),
  setSelectedAlbum: (album, layoutId) =>
    set({ selectedAlbum: album, layoutId: album ? layoutId : undefined }),
}));
