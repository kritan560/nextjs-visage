import {
  UniversalImageType,
  UniversalImagesType,
} from "@/types/universalImage.type";
import { Images } from "@prisma/client";

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
 * @param images
 * @returns
 */
export function AugmentImagesIntoUniversalImages(images: Images[]) {
  const augmentedImages: UniversalImagesType = images.map(
    ({ title, location, tags, createdAt, updatedAt, ...img }) => {
      const univeralImageType = img.image as UniversalImageType;
      return {
        ...univeralImageType,
      };
    },
  );

  return augmentedImages;
}

/**
 *
 * @param images
 * @returns
 */
export function AugmentImagesImageField(images: Images[]) {
  const img = images.map((img) => {
    return { ...img, image: img.image as UniversalImageType };
  });
  return img;
}
