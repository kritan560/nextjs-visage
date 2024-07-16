// !!! make UniversalImages , UniversalImage Type

import { UniversalImageType, UniversalImagesType } from "@/types/visage-type";
import { LikedImages } from "@prisma/client";
import { Photos } from "pexels";

/**
 * takes the photos and returns the augmented Universal Image type response
 * @param photo
 * @returns
 */
export async function AugmentPixelCuratedPhotosIntoUniversalImages(
  photo: Photos
): Promise<UniversalImagesType> {
  // removing the "liked" property from photo.photos and converting the photographer_id to string..
  // Photo type has photographer_id as string but returns as number so converting it. here in augment
  const universalImages: UniversalImagesType = photo.photos.map((p) => {
    const { liked, ...withoutLiked } = {
      ...p,
      photographer_id: String(p.photographer_id),
      userId: "",
      imageId: p.id.toString(),
    };

    return withoutLiked;
  });

  return universalImages;
}

/**
 * @param likedImage
 * @returns
 */
export function AugmentLikedImageIntoUniversalImage(
  likedImage: LikedImages
): UniversalImageType {
  const img = likedImage.likedImage as UniversalImageType;

  return {
    ...img,
    id: img.id,
  };
}
