"use server";

import {
  AugmentVideoIntoUniversalvideoType,
  AugmentVideosIntoUniversalVideosType,
} from "@/augments/pexelVideo.augment";
import {
  GetRandomVideoEnum,
  GetVideosByKeywordEnum,
  GetVideosEnum,
  getPexelVideoByIdEnum,
} from "../../enums/PexelVideo.enum";
import { pexel } from "./pexel-client";

/**
 * This server action will get the Pexel Video by Id
 *
 * @param videoId - The Video Id
 * @returns
 */
export async function getPexelVideoById(videoId: string) {
  try {
    const video = await pexel.videos.show({ id: videoId });

    const typeChecker = pexel.typeCheckers.isError(video);
    if (!typeChecker) {
      const augmentedPexelVideo = AugmentVideoIntoUniversalvideoType(video);

      if (augmentedPexelVideo) {
        return {
          success: {
            data: augmentedPexelVideo,
            message: getPexelVideoByIdEnum.FOUND_VIDEOS,
          },
        };
      }
    }
    if (typeChecker) {
      return {
        failed: {
          data: null,
          message: getPexelVideoByIdEnum.NULL,
        },
      };
    }

    return {
      failed: { data: null, message: getPexelVideoByIdEnum.NULL },
    };
  } catch (error) {
    console.error(error);
    return { failed: { data: null, message: getPexelVideoByIdEnum.NULL } };
  }
}

/**
 * This server action will return the popular videos from pexels API.
 *
 * @returns
 */
export async function getVideos(page = 1, per_page = 15) {
  try {
    const videos = await pexel.videos.popular({
      page: page,
      per_page: per_page,
    });
    const typeCheckerIsVideos = pexel.typeCheckers.isVideos(videos);
    const typeCheckerIsError = pexel.typeCheckers.isError(videos);

    if (typeCheckerIsVideos) {
      const augmentedVideos = AugmentVideosIntoUniversalVideosType(videos);
      return {
        success: { data: augmentedVideos, message: GetVideosEnum.VIDEOS_FOUND },
      };
    }
    if (typeCheckerIsError) {
      return {
        failed: { data: null, message: GetVideosEnum.FAILED_TO_GET_ALL_VIDEOS },
      };
    }
    return {
      failed: { data: null, message: GetVideosEnum.FAILED_TO_GET_ALL_VIDEOS },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: { data: null, message: GetVideosEnum.FAILED_TO_GET_ALL_VIDEOS },
    };
  }
}

/**
 * This server action will return the universalVideosType by searched keyword
 *
 * @param keyword - The searched keyword
 * @param page - The page to searched for
 * @param per_page - The number of result per page
 * @returns
 */
export async function getVideosByKeyword(
  keyword: string,
  page = 1,
  per_page = 15,
) {
  try {
    const videos = await pexel.videos.search({
      query: keyword,
      page: page,
      per_page: per_page,
    });
    const typeChecker = pexel.typeCheckers.isVideos(videos);
    const typeCheckerIsError = pexel.typeCheckers.isError(videos);

    if (typeChecker) {
      const augmentedVideos = AugmentVideosIntoUniversalVideosType(videos);
      return {
        success: {
          data: augmentedVideos,
          message: GetVideosByKeywordEnum.VIDEOS_FOUND,
        },
      };
    }
    if (typeCheckerIsError) {
      return {
        failed: { data: null, message: GetVideosEnum.FAILED_TO_GET_ALL_VIDEOS },
      };
    }
    return {
      failed: { data: null, message: GetVideosEnum.FAILED_TO_GET_ALL_VIDEOS },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        message: GetVideosByKeywordEnum.FAILED_TO_GET_VIDEOS,
      },
    };
  }
}

/**
 * This server action will return the Popular videos later choose one video randomly
 *
 * @returns
 */
export async function getRandomVideo() {
  try {
    const randomVideo = await pexel.videos.popular();
    const isVideosTypeCheck = pexel.typeCheckers.isVideos(randomVideo);
    const isErrorTypeCheck = pexel.typeCheckers.isError(randomVideo);

    if (isVideosTypeCheck) {
      const randomNumberFrom1To15 = Math.ceil(Math.random() * 15);

      const augmentVideosIntoUniversalVideos =
        AugmentVideosIntoUniversalVideosType(randomVideo).videos[
          randomNumberFrom1To15
        ];

      return {
        success: {
          data: augmentVideosIntoUniversalVideos,
          message: GetRandomVideoEnum.VIDEO_FOUND,
        },
      };
    }

    if (isErrorTypeCheck) {
      return {
        failed: {
          data: null,
          message: GetRandomVideoEnum.FAILED_TO_GET_RANDOM_VIDEO,
        },
      };
    }

    return {
      failed: {
        data: null,
        message: GetRandomVideoEnum.FAILED_TO_GET_RANDOM_VIDEO,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        message: GetRandomVideoEnum.FAILED_TO_GET_RANDOM_VIDEO,
      },
    };
  }
}
