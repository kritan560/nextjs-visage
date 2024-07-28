"use server";

import {
  AugmentPexelCuratedPhotoIntoUniversalImage,
  AugmentPexelCuratedPhotosIntoUniversalImages,
  AugmentPixelSearchedPhotoIntoUniversalImage,
} from "@/augments/pexelPhoto.augment";
import {
  GetRandomPhotoEnum,
  getPexelPhotoByIdEnum,
} from "../../enums/PexelPhoto.enum";
import { pexel } from "./pexel-client";

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
 * This server action will return the random universalImage when request
 *
 * @returns
 */
export async function getRandomPhoto() {
  try {
    const randomPhoto = await pexel.photos.random();
    const isErrorTypechecker = pexel.typeCheckers.isError(randomPhoto);

    if (!isErrorTypechecker) {
      const augmentImageIntoUniversalImage =
        AugmentPexelCuratedPhotoIntoUniversalImage(randomPhoto);

      return {
        success: {
          data: augmentImageIntoUniversalImage,
          message: GetRandomPhotoEnum.PHOTO_FOUND,
        },
      };
    }
    return {
      failed: {
        data: null,
        message: GetRandomPhotoEnum.FAILED_TO_GET_RANDOM_PHOTO,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        messasge: GetRandomPhotoEnum.FAILED_TO_GET_RANDOM_PHOTO,
      },
    };
  }
}
