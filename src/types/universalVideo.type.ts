import { Video, Videos } from "pexels";

/**
 *
 */
export type UniversalVideoType = Pick<
  Video,
  | "id" // the video id in type number
  | "image" // image contain the video thumbnail
  | "video_files" // the video_files contains the array of video resolution
  | "user" // the videographer
> & { videoId: string }; // videoId is generated at augmentation if id is type number i.e. videoId : String(id) else if type string videoId : id

export type UniversalVideosType = {
  videos: UniversalVideoType[];
  totalResults: Videos["total_results"];
};
