"use server";

import { DailyUploadCount } from "@/constants/constants";
import { Images } from "@prisma/client";
import prisma from "../../prisma/prisma.db";
import {
  AugmentImageIntoUniversalImage,
  AugmentImagesImageField,
  AugmentImagesIntoUniversalImages,
} from "../augments/Image.augment";
import {
  CreateImagesEnum,
  GetAllImagesEnum,
  GetImageByIdEnum,
  GetImagesByTagsEnum,
  GetImagesEnum,
  GetTotalViewsCountEnum,
} from "../enums/Image.enum";
import { AuthFailedEnum } from "../enums/authentication-server-enums";
import { getDailyImagesUploadCount } from "./Upload.server";
import { getCurrentUserId } from "./Authentication.server";

/**
 * This server action will search for the unique image in DB.
 *
 * if image is found, augment image into universalImage and return it
 *
 * if user is not authenticated return the USER_NOT_LOGGED_IN response object.
 *
 * @param id - The Image Id
 */
export async function getImageById(id: string) {
  try {
    // user auth checks is not necessary here because unauth user can also query the image via id

    const image = await prisma.images.findUnique({ where: { id } });

    if (image) {
      const previousViewCount = image.views ?? 0;

      // updating the views count
      await prisma.images.update({
        data: { views: previousViewCount + 1 },
        where: { id: image.id },
      });

      const augmentImageIntoUniversalImage =
        AugmentImageIntoUniversalImage(image);
      return {
        success: {
          data: augmentImageIntoUniversalImage,
          message: GetImageByIdEnum.USER_IMAGE,
        },
      };
    }
    return {
      failed: { data: null, message: GetImageByIdEnum.FAILED_TO_GET_IMAGE },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: { data: null, message: GetImageByIdEnum.FAILED_TO_GET_IMAGE },
    };
  }
}

/**
 * This server action will search for all images uploaded by the user.
 *
 * if found augment the image into UniversalImages
 *
 * return the user uploaded augmented images.
 *
 * if user is not authenticated return the USER_NOT_LOGGED_IN response object.
 */
export async function getImages() {
  try {
    const { userId } = await getCurrentUserId();

    if (!userId) {
      return {
        failed: {
          data: null,
          message: AuthFailedEnum.USER_NOT_LOGGED_IN,
        },
      };
    }

    const images = await prisma.images.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const augmentedImages = AugmentImagesIntoUniversalImages(images);
    return {
      success: {
        data: augmentedImages,
        message: GetImagesEnum.USER_IMAGES,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        message: GetImagesEnum.FAILED_TO_GET_IMAGES,
      },
    };
  }
}

/**
 * This server action will perform checks for dailyUploadCount
 *
 * create images if daily count not exceed.
 *
 * if user is not authenticated return the USER_NOT_LOGGED_IN response object.
 *
 * @param images - The prisma Images Types
 */
export async function createImages(images: Images[]) {
  const augmentedImages = AugmentImagesImageField(images);
  try {
    const { isUserAuthenticated } = await getCurrentUserId();

    if (!isUserAuthenticated) {
      return {
        failed: {
          data: null,
          redirect: true,
          message: AuthFailedEnum.USER_NOT_LOGGED_IN,
        },
      };
    }

    const { userId } = await getCurrentUserId();

    if (!userId) {
      return {
        failed: {
          data: null,
          message: AuthFailedEnum.USER_NOT_LOGGED_IN,
        },
      };
    }

    const { success } = await getDailyImagesUploadCount();
    if (success) {
      const dailyUploadCount = success.data;
      const dailyUploadCountLimit = DailyUploadCount;

      // checks to ensure the daily upload limit won't exceed.
      if (images.length + dailyUploadCount > dailyUploadCountLimit) {
        return {
          failed: {
            data: null,
            message: `${
              CreateImagesEnum.DAILY_COUNT_EXCEDDED
            } Upload Limit Left : ${dailyUploadCountLimit - dailyUploadCount}`,
          },
        };
      }
    }

    const newImages = await prisma.images.createMany({
      data: augmentedImages,
    });
    return {
      success: { data: newImages, message: CreateImagesEnum.IMAGE_CREATED },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        message: CreateImagesEnum.FAILED_TO_CREATE_IMAGES,
      },
    };
  }
}

/**
 * This server action will get the totalViewsCount and totalContent of currently loggedin User
 *
 * if user is not authenticated return the USER_NOT_LOGGED_IN response object.
 *
 */
export async function getTotalImagesViewsCount() {
  try {
    const { isUserAuthenticated } = await getCurrentUserId();

    if (!isUserAuthenticated) {
      return {
        failed: {
          data: null,
          redirect: true,
          message: AuthFailedEnum.USER_NOT_LOGGED_IN,
        },
      };
    }

    const { userId } = await getCurrentUserId();
    if (!userId) {
      return {
        failed: {
          data: null,
          message: AuthFailedEnum.USER_NOT_LOGGED_IN,
        },
      };
    }

    const totalViews = await prisma.images.findMany({
      where: {
        userId: userId,
      },
      select: { views: true },
    });

    const totalContent = totalViews.length;
    const views: number = totalViews.reduce(
      (prev, current) => prev + current.views,
      0,
    );

    return {
      success: {
        data: { views, totalContent },
        message: GetTotalViewsCountEnum.FOUND_VIEWS,
      },
    };
  } catch (error) {
    return {
      failed: { data: null, message: GetTotalViewsCountEnum.FOUND_VIEWS },
    };
  }
}

/**
 * This server action will get all the images by given tag
 *
 * @param tags - The keyword to search in image
 * @returns
 */
export async function getImagesByTags(tags: string) {
  try {
    const images = await prisma.images.findMany({
      where: { tags: { has: tags } },
      select: { image: true },
    });
    return {
      success: { data: images, message: GetImagesByTagsEnum.IMAGE_FOUND },
    };
  } catch (error) {
    console.error(error);

    return {
      failed: { data: null, message: GetImagesByTagsEnum.FAILED_TO_GET_IMAGES },
    };
  }
}

/**
 * This server action will get all the images that user uploads.
 *
 * augment the images into UniversalImagesType
 *
 * @returns
 */
export async function getAllImages() {
  try {
    const allImages = await prisma.images.findMany();

    const augmentedAllImages = AugmentImagesIntoUniversalImages(allImages);
    return {
      success: {
        data: augmentedAllImages,
        message: GetAllImagesEnum.IMAGE_FOUND,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        message: GetAllImagesEnum.FAILED_TO_GET_ALL_IMAGES,
      },
    };
  }
}
