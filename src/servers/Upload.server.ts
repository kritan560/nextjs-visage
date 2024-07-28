"use server";

import prisma from "../../prisma/prisma.db";
import {
  DeleteUserUploadedImageEnum,
  DeleteUserUploadedVideoEnum,
  GetDailyImagesUploadCountEnum,
  GetUserUploadedImageIdEnum,
} from "../enums/Upload.enum";
import { getCurrentUserId } from "./Authentication.server";
import { AuthFailedEnum } from "../enums/authentication-server-enums";

/**
 * This server action will return the number of images uploaded in a 24 hr interval
 *
 * if user is not authenticated return the USER_NOT_LOGGED_IN response object.
 */
export async function getDailyImagesUploadCount() {
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

    const today = new Date();
    const a24hrBefore = new Date().getTime() - 86400000;
    const aDayBefore = new Date(a24hrBefore);

    // find all uploaded images between 24 hr interval.
    const dailyUploadCount = await prisma.images.findMany({
      where: { createdAt: { gte: aDayBefore, lte: today }, userId },
    });
    return {
      success: {
        data: dailyUploadCount.length,
        message: GetDailyImagesUploadCountEnum.UPLOAD_COUNT,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        message: GetDailyImagesUploadCountEnum.FAILED_TO_GET_UPLOAD_COUNT,
      },
    };
  }
}

/**
 * This server action will get all the ImageIds of a currently authenticated user
 *
 * if user is not authenticated return the USER_NOT_LOGGED_IN response object.
 *
 * @returns
 */
export async function getAuthUserUploadedImageId() {
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

    const imageId = await prisma.images.findMany({
      where: { userId },
      select: { imageId: true },
    });

    return {
      success: {
        data: imageId,
        message: GetUserUploadedImageIdEnum.IMAGE_ID_FOUND,
      },
    };
  } catch (error) {
    console.error(error);

    return {
      failed: {
        data: null,
        message: GetUserUploadedImageIdEnum.FAILED_TO_GET_IMAGE_IDS,
      },
    };
  }
}

/**
 * This server action will delete the user Uploaded image from the server
 *
 * it will only delete the image. if image is liked or in collection it won't be delete from there.
 *
 * if user is not authenticated return the USER_NOT_LOGGED_IN response object.
 *
 * @param imageId - The Image Id
 * @returns
 */
export async function deleteUserUploadedImage(imageId: string) {
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

    const deletedImage = await prisma.images.delete({ where: { imageId } });

    return {
      success: {
        data: deletedImage,
        message: DeleteUserUploadedImageEnum.IMAGE_DELETED,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        message: DeleteUserUploadedImageEnum.FAILED_TO_DELETE_IMAGE,
      },
    };
  }
}

/**
 * This server action will delete the user Uploaded video from the server
 *
 * it will only delete the video. if video is liked or in collection it won't be delete from there.
 *
 * if user is not authenticated return the USER_NOT_LOGGED_IN response object.
 *
 * !!!!!! Currently user can't upload the video !!!!!!
 *
 * @param videoId - The Video Id
 * @returns
 */
export async function deleteUserUploadedVideo(videoId: string) {
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

    const deletedImage = await prisma.videos.delete({ where: { videoId } });

    return {
      success: {
        data: deletedImage,
        message: DeleteUserUploadedVideoEnum.VIDEO_DELETED,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        message: DeleteUserUploadedVideoEnum.FAILED_TO_DELETE_VIDEO,
      },
    };
  }
}
