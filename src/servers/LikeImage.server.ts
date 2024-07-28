"use server";

import { UniversalImageType } from "@/types/universalImage.type";
import { getCurrentUserId } from "./Authentication.server";
import { AuthFailedEnum } from "../enums/authentication-server-enums";
import prisma from "../../prisma/prisma.db";
import {
  AugmentLikedImageIntoUniversalImage,
  AugmentLikedImagesIntoUniversalImages,
} from "../augments/LikeImage.augment";
import { GetLikedImagesEnum, LikeImageEnum } from "../enums/LikeImage.enum";
import { revalidatePath } from "next/cache";
import { LinkLikePage } from "@/links/visage-links";

/**
 * This server action takes the image of UniversalImageType
 *
 * add image to the liked image for the logged in user.
 *
 * when clicked and removes when clicked again.
 *
 * if user is not authenticated return the USER_NOT_LOGGED_IN response object.
 *
 * @param image - The UniversalImageType
 * @returns
 */
export async function likeImage(image: UniversalImageType) {
  try {
    const { userId } = await getCurrentUserId();

    if (!userId) {
      return {
        failed: {
          data: null,
          redirect: true,
          message: AuthFailedEnum.USER_NOT_LOGGED_IN,
        },
      };
    }

    // check if the image is collected previously if collected uncollect else collect the image
    const isPreviousCollectPhoto = await prisma.likedImages.findUnique({
      where: { likedImage: image },
    });

    if (isPreviousCollectPhoto) {
      const deletedPhoto = await prisma.likedImages.delete({
        where: { likedImage: image },
      });

      const augmentedLikeImage =
        AugmentLikedImageIntoUniversalImage(deletedPhoto);

      // revalidatePath(LinkLikePage);

      return {
        success: {
          data: augmentedLikeImage,
          redirect: false,
          message: LikeImageEnum.IMAGE_LIKED,
        },
      };
    }

    const { id, totalResult, ...likeImageSchemaData } = image; // this const part is not needed check!!!

    const collectedPhoto = await prisma.likedImages.create({
      data: { likedImage: image, userId: userId },
    });

    const augmentedLikeImage =
      AugmentLikedImageIntoUniversalImage(collectedPhoto);

    revalidatePath(LinkLikePage);

    return {
      success: {
        data: augmentedLikeImage,
        redirect: false,
        message: LikeImageEnum.IMAGE_LIKED,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        redirect: false,
        message: LikeImageEnum.FAILED_TO_LIKE_PHOTO,
      },
    };
  }
}

/**
 * This server action gets all the liked images of authenticated user.
 *
 * if user is not authenticated return the USER_NOT_LOGGED_IN response object.
 * @returns
 */
export async function getLikedImages() {
  try {
    const { userId } = await getCurrentUserId();

    if (!userId) {
      return {
        failed: { data: null, message: AuthFailedEnum.USER_NOT_LOGGED_IN },
      };
    }

    const collectPhotos = await prisma.likedImages.findMany({
      where: { userId },
    });

    const augmentedLikeImage =
      AugmentLikedImagesIntoUniversalImages(collectPhotos);
    return {
      success: {
        data: augmentedLikeImage,
        message: GetLikedImagesEnum.GOT_LIKED_PHOTO,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        message: GetLikedImagesEnum.FAILED_TO_GET_LIKED_PHOTO,
      },
    };
  }
}
