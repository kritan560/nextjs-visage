"use server";

import {
  AugmentPexelCuratedPhotoIntoUniversalImage,
  AugmentPexelCuratedPhotosIntoUniversalImages,
  AugmentPixelSearchedPhotoIntoUniversalImage,
  AugmentVideoIntoUniversalvideoType,
  AugmentVideosIntoUniversalVideosType,
} from "@/augment/augment";
import { pexel } from "./pexel-client";
import {
  GetVideosByKeywordEnum,
  GetVideosEnum,
  getPexelPhotoByIdEnum,
  getPexelVideoByIdEnum,
} from "./pexel-server-enums";

/**
 * This server action will get the curated photos.
 *
 * @param page number - the default value of page is 1
 * @param per_page number - The default value of per_page is 15
 * @returns
 */
export async function getPexelCuratedPhotosByPage_PerPage(
  page = 1,
  per_page = 15,
) {
  try {
    const curatedPexelPhotos = await pexel.photos.curated({ page, per_page });

    const typeChecker = pexel.typeCheckers.isPhotos(curatedPexelPhotos);

    if (typeChecker) {
      const augmentedPexelCuratedPhoto =
        AugmentPexelCuratedPhotosIntoUniversalImages(curatedPexelPhotos);

      return augmentedPexelCuratedPhoto;
    }

    return null;
  } catch (error) {
    console.error(error);
    throw new Error("failed to get curated photos");
  }
}

/**
 * This server action will get the Pexel Photo by Id
 *
 * @param photoId - The Photo Id
 * @returns
 */
export async function getPexelPhotoById(photoId: string) {
  try {
    const photo = await pexel.photos.show({ id: photoId });

    const typeChecker = pexel.typeCheckers.isError(photo);
    if (!typeChecker) {
      const augmentedPexelPhoto =
        AugmentPexelCuratedPhotoIntoUniversalImage(photo);

      return {
        success: {
          data: augmentedPexelPhoto,
          message: getPexelPhotoByIdEnum.FOUND_PHOTOS,
        },
      };
    }

    // the return type is NULL coz in frontend it will switch to user uploaded images based on server NULL response
    return {
      failed: { data: null, message: getPexelPhotoByIdEnum.NULL },
    };
  } catch (error) {
    // console.error(error);
    return { failed: { data: null, message: getPexelPhotoByIdEnum.NULL } };
  }
}

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
 * This server action will get the Pexel photo by keyword
 *
 * @param keyword - The keyword for photos
 * @param page  - The page number
 * @param per_page - The amount of content per page
 * @returns
 */
export async function getPexelPhotoByKeyword(
  keyword: string,
  page = 1,
  per_page = 15,
) {
  try {
    const searchedPhoto = await pexel.photos.search({
      query: keyword,
      page,
      per_page,
    });
    const typeChecker = pexel.typeCheckers.isPhotos(searchedPhoto);
    if (typeChecker) {
      const augmentedPixelPhoto =
        await AugmentPixelSearchedPhotoIntoUniversalImage(searchedPhoto);
      return augmentedPixelPhoto;
    }
    return null;
  } catch (error) {
    console.error(error);
    throw new Error("failed to get pexel photo by keyword");
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
