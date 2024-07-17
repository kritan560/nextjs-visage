"use server";

import {
  AugmentPexelCuratedPhotoIntoUniversalImage,
  AugmentPexelCuratedPhotosIntoUniversalImages,
} from "@/augment/augment";
import { pexel } from "./pexel-client";
import { getPexelPhotoByIdEnum } from "./pexel-server-enums";

/**
 * @param page number - the default value of page is 1
 * @param per_page number - The default value of per_page is 15
 * @returns
 */
export async function getPexelCuratedPhotosByPage_PerPage(
  page = 1,
  per_page = 15
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
 *
 * @param photoId
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
    return {
      failed: { data: null, message: getPexelPhotoByIdEnum.NOT_PHOTO_TYPE },
    };
  } catch (error) {
    console.error(error);
    return { failed: { data: null, message: getPexelPhotoByIdEnum.NULL } };
  }
}
