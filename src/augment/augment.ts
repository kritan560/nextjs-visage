// !!! make UniversalImages , UniversalImage Type

import { UniversalImageType, UniversalImagesType } from "@/types/visage-type";
import { Images, LikedImages } from "@prisma/client";
import { Photo, Photos, PhotosWithTotalResults } from "pexels";

/**
 * takes the photos and returns the augmented Universal Image type response
 * @param photo
 * @returns
 */
export async function AugmentPexelCuratedPhotosIntoUniversalImages(
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

/**
 *
 */
export function AugmentLikedImagesIntoUniversalImages(
  likedImages: LikedImages[]
): UniversalImagesType {
  const augmentedLikeImages = likedImages.map((likedImage) => {
    return likedImage.likedImage as UniversalImageType;
  });

  return augmentedLikeImages;
}

/**
 *
 * @param image
 * @returns
 */
export function AugmentImageIntoUniversalImage(image: Images) {
  const PrismaJsonValue = image.image as UniversalImageType;
  const augmentedImages: UniversalImageType = {
    ...PrismaJsonValue,
    imageId: image.id,
  };

  return augmentedImages;
}

/**
 *
 * @param photo
 * @returns
 */
export function AugmentPexelCuratedPhotoIntoUniversalImage(
  photo: Photo
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

export function AugmentImagesIntoUniversalImages(images: Images[]) {
  const augmentedImages: UniversalImagesType = images.map(
    ({ title, location, tags, createdAt, updatedAt, ...img }) => {
      const univeralImageType = img.image as UniversalImageType;
      return {
        ...univeralImageType,
      };
    }
  );

  return augmentedImages;
}


export async function AugmentPixelSearchedPhotoIntoUniversalImage(
  photo: PhotosWithTotalResults
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
