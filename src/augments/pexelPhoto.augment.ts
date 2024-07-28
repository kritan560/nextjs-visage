import {
  UniversalImageType,
  UniversalImagesType,
} from "@/types/universalImage.type";
import { Photo, Photos, PhotosWithTotalResults } from "pexels";

/**
 * takes the photos and returns the augmented Universal Image type response
 * @param photo
 * @returns
 */
export async function AugmentPexelCuratedPhotosIntoUniversalImages(
  photo: Photos,
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
 *
 * @param photo
 * @returns
 */
export function AugmentPexelCuratedPhotoIntoUniversalImage(
  photo: Photo,
): UniversalImageType {
  // removing the "liked" property by destructuring and
  // converting the photographer_id to string because it is what in type Photo
  const { liked, ...universalImage } = {
    ...photo,
    photographer_id: String(photo.photographer_id),
    imageId: photo.id.toString(),
    userId: "",
  };

  return universalImage;
}

/**
 *
 * @param photo
 * @returns
 */
export async function AugmentPixelSearchedPhotoIntoUniversalImage(
  photo: PhotosWithTotalResults,
): Promise<UniversalImagesType> {
  const universalPhotos: UniversalImagesType = photo.photos.map((p) => {
    const { liked, ...withoutLiked } = {
      ...p,
      photographer_id: String(p.photographer_id),
      userId: "",
      imageId: p.id.toString(),
    };

    return { ...withoutLiked, totalResult: photo.total_results };
  });
  return universalPhotos;
}
