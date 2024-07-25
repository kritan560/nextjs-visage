import { Photo, Video, Videos } from "pexels";

export type onHoverDisplayElementsType = {
  elementName: MediaType;
  element: JSX.Element;
}[];

export type MediaType = "Image" | "Video";

/**
 * @example
 * {
  "id": 2014422,
  "width": 3024,
  "height": 3024,
  "url": "https://www.pexels.com/photo/brown-rocks-during-golden-hour-2014422/",
  "photographer": "Joey Farina",
  "photographer_url": "https://www.pexels.com/@joey",
  "photographer_id": 680589,
  "avg_color": "#978E82",
  "src": {
    "original": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg",
    "large2x": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    "large": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "medium": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&h=350",
    "small": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&h=130",
    "portrait": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    "landscape": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    "tiny": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280"
  },
  "alt": "Brown Rocks During Golden Hour",
  "userId" : "2014422",
  "imageId" : "uniqueImageId",
  "totalResult" : 12 | undefined
}
 */
export type UniversalImageType = Omit<Photo, "liked"> & {
  userId: string;
  imageId: string;
  totalResult?: number;
};

export type UniversalImagesType = UniversalImageType[];

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

// video : id, image, url, videoFiles
