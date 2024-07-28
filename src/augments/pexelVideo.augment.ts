import {
  UniversalVideoType,
  UniversalVideosType,
} from "@/types/universalVideo.type";
import { Video, Videos } from "pexels";

export function AugmentVideosIntoUniversalVideosType(videos: Videos) {
  const v = videos.videos;

  const videoLists = v.map((data) => ({
    id: data.id,
    videoId: String(data.id),
    image: data.image,
    url: data.url,
    video_files: data.video_files,
    user: data.user,
  }));

  const augmentedVideos: UniversalVideosType = {
    videos: videoLists,
    totalResults: videos.total_results,
  };

  return augmentedVideos;
}

export function AugmentVideoIntoUniversalvideoType(video: Video) {
  const augmentVideo: UniversalVideoType = {
    id: video.id,
    image: video.image,
    user: video.user,
    video_files: video.video_files,
    videoId: String(video.id),
  };

  return augmentVideo;
}
