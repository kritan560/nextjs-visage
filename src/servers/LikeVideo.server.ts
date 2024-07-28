"use server";

import { UniversalVideoType } from "@/types/universalVideo.type";
import prisma from "../../prisma/prisma.db";
import {
  AugmentLikedVideoIntoUniversalVideo,
  AugmentLikedVideosIntoUniversalVideos,
} from "../augments/LikeVideo.augment";
import { GetLikedVideosEnum, LikeVideoEnum } from "../enums/LikeVideo.enum";
import { getCurrentUserId } from "./Authentication.server";
import { AuthFailedEnum } from "../enums/authentication-server-enums";
import { revalidatePath } from "next/cache";
import { LinkLikePage } from "@/links/visage-links";

/**
 * This server action gets all the liked images of authenticated user.
 *
 * if user is not authenticated return the USER_NOT_LOGGED_IN response object.
 * @returns
 */
export async function getLikedVideos() {
  try {
    const { userId } = await getCurrentUserId();

    if (!userId) {
      return {
        failed: { data: null, message: AuthFailedEnum.USER_NOT_LOGGED_IN },
      };
    }

    const collectVideos = await prisma.likedVideos.findMany({
      where: { userId },
    });

    const augmentedLikeImage =
      AugmentLikedVideosIntoUniversalVideos(collectVideos);
    return {
      success: {
        data: augmentedLikeImage,
        message: GetLikedVideosEnum.GOT_LIKED_VIDEO,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        message: GetLikedVideosEnum.FAILED_TO_GET_LIKED_VIDEO,
      },
    };
  }
}

/**
 * This server action gets all the liked videos ids of authenticated user.
 *
 * if user is not authenticated return the USER_NOT_LOGGED_IN response object.
 * @returns
 */
export async function getLikedVideosIds() {
  try {
    const { userId } = await getCurrentUserId();

    if (!userId) {
      return {
        failed: { data: null, message: AuthFailedEnum.USER_NOT_LOGGED_IN },
      };
    }

    const videos = await prisma.likedVideos.findMany({
      where: { userId },
    });

    const likedVideosIds = videos
      .map((data) => data.likedVideo as UniversalVideoType)
      .map((id) => id.videoId);

    return {
      success: {
        data: likedVideosIds,
        message: GetLikedVideosEnum.GOT_LIKED_VIDEO,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        message: GetLikedVideosEnum.FAILED_TO_GET_LIKED_VIDEO,
      },
    };
  }
}

/**
 * This server action takes the video of UniveraslVideoType
 *
 * add video to the liked image for the logged in user.
 *
 * when clicked and removes when clicked again.
 *
 * if user is not authenticated return the USER_NOT_LOGGED_IN response object.
 *
 * @param image - The UniversalVideoType
 * @returns
 */
export async function likeVideo(video: UniversalVideoType) {
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
    const isPreviousCollectPhoto = await prisma.likedVideos.findUnique({
      where: { likedVideo: video },
    });

    if (isPreviousCollectPhoto) {
      const deletedPhoto = await prisma.likedVideos.delete({
        where: { likedVideo: video },
      });

      const augmentedLikeImage =
        AugmentLikedVideoIntoUniversalVideo(deletedPhoto);

      return {
        success: {
          data: augmentedLikeImage,
          redirect: false,
          message: LikeVideoEnum.VIDEO_UNLIKED,
        },
      };
    }

    const collectedPhoto = await prisma.likedVideos.create({
      data: { likedVideo: video, userId: userId },
    });

    const augmentedLikeImage =
      AugmentLikedVideoIntoUniversalVideo(collectedPhoto);

    revalidatePath(LinkLikePage);

    return {
      success: {
        data: augmentedLikeImage,
        redirect: false,
        message: LikeVideoEnum.VIDEO_LIKED,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        redirect: false,
        message: LikeVideoEnum.FAILED_TO_LIKE_VIDEO,
      },
    };
  }
}
