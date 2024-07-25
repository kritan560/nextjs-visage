import { UniversalVideosType } from "@/types/visage-type";
import { create } from "zustand";

type GlobalCollectVideosIds = {
  videosIds: string[];
  setVideosIds: (ids: string[] | undefined) => void;
};

export const useGlobalCollectVideosIds = create<GlobalCollectVideosIds>(
  (set) => ({ videosIds: [], setVideosIds: (ids) => set({ videosIds: ids }) }),
);

type GlobalLikeVideosIds = {
  videosIds: string[];
  setVideosIds: (ids: string[] | undefined) => void;
};

export const useGlobalLikeVideosIds = create<GlobalLikeVideosIds>((set) => ({
  videosIds: [],
  setVideosIds: (ids) => set({ videosIds: ids }),
}));

type GlobalVideos = {
  videos: UniversalVideosType["videos"];
  setVideos: (ids: UniversalVideosType["videos"] | undefined) => void;
};

export const useGlobalVideos = create<GlobalVideos>((set) => ({
  videos: [],
  setVideos: (ids) => set({ videos: ids }),
}));
