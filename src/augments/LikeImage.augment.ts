import {
  UniversalImageType,
  UniversalImagesType,
} from "@/types/universalImage.type";
import { LikedImages } from "@prisma/client";

/**
 * @param likedImage
 * @returns
 */
export function AugmentLikedImageIntoUniversalImage(
  likedImage: LikedImages,
): UniversalImageType {
  const img = likedImage.likedImage as UniversalImageType;

  return {
    ...img,
    id: img.id,
  };
}

/**
 *
 */
export function AugmentLikedImagesIntoUniversalImages(
  likedImages: LikedImages[],
): UniversalImagesType {
  const augmentedLikeImages = likedImages.map((likedImage) => {
    return likedImage.likedImage as UniversalImageType;
  });

  return augmentedLikeImages;
}
