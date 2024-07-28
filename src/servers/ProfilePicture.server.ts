"use server";

import prisma from "../../prisma/prisma.db";
import {
  GetPublicProfilePictureEnum,
  GetUserProfilePictureEnum,
} from "../enums/ProfilePicture.enum";
import { getCurrentUserId } from "./Authentication.server";
import { AuthFailedEnum } from "../enums/authentication-server-enums";

/**
 * This server action will only return the profile picture image link.
 *
 * if user is not authenticated return the USER_NOT_LOGGED_IN response object.
 *
 * @param userId - The user id
 * @returns
 */
export async function getUserProfilePicture(userId?: string) {
  try {
    const { isUserAuthenticated } = await getCurrentUserId();

    if (!isUserAuthenticated) {
      return {
        failed: { data: null, message: AuthFailedEnum.USER_NOT_LOGGED_IN },
      };
    }

    const profilePicture = await prisma.user.findUnique({
      where: { id: userId },
      select: { image: true },
    });
    return {
      success: {
        data: profilePicture,
        message: GetUserProfilePictureEnum.GOT_PROFILE_PICTURE,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        message: GetUserProfilePictureEnum.FAILED_TO_GET_PROFILE_PICTURE,
      },
    };
  }
}

/**
 * This server action will only return the profile picture image link and userId.
 *
 * @returns
 */
export async function getPublicProfilePictures() {
  try {
    const profilePicture = await prisma.user.findMany({
      select: { image: true, id: true },
    });

    return {
      success: {
        data: profilePicture,
        message: GetPublicProfilePictureEnum.GOT_PROFILE_PICTURE,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        message: GetPublicProfilePictureEnum.FAILED_TO_GET_PROFILE_PICTURE,
      },
    };
  }
}
