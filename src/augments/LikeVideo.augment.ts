import {
  UniversalVideoType,
  UniversalVideosType,
} from "@/types/universalVideo.type";
import { LikedVideos } from "@prisma/client";

/**
 *
 */
export function AugmentLikedVideosIntoUniversalVideos(
  likedVideos: LikedVideos[],
): UniversalVideosType["videos"] {
  const augmentedLikedVideos = likedVideos.map((likedVideo) => {
    return likedVideo.likedVideo as UniversalVideoType;
  });

  return augmentedLikedVideos;
}

/**
 * @param likedImage
 * @returns
 */
export function AugmentLikedVideoIntoUniversalVideo(
  likedVideos: LikedVideos,
): UniversalVideoType {
  const vid = likedVideos.likedVideo as UniversalVideoType;

  return {
    ...vid,
    id: vid.id,
  };
}
