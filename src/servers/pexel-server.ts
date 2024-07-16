"use server";

import { AugmentPixelCuratedPhotosIntoUniversalImages } from "@/augment/augment";
import { pexel } from "./pexel-client";

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
      const augmentedPixelCuratedPhoto =
        AugmentPixelCuratedPhotosIntoUniversalImages(curatedPexelPhotos);

      return augmentedPixelCuratedPhoto;
    }

    return null;
  } catch (error) {
    console.error(error);
    throw new Error("failed to get curated photos");
  }
}
