"use server";

import { EditProfileFormSchemaType } from "@/schemas/editProfileFormSchema";
import { getCurrentUserId } from "./Authentication.server";
import { AuthFailedEnum } from "../enums/authentication-server-enums";
import prisma from "../../prisma/prisma.db";
import { capitalize } from "@/helpers/capitalize";
import {
  UpdateUserDetailEnum,
  UpdateUserProfilePictureEnum,
} from "../enums/User.enum";

/**
 * this server action will update the userDetail.
 *
 * NOTE: profile picture is not included here because it was not the part of form data.
 *
 * if user is not authenticated return the USER_NOT_LOGGED_IN response object.
 *
 * @param {string} userId - The user id
 * @param updatedData - The updated Data
 */
export async function updateUserDetail({
  userId,
  updatedData,
}: {
  userId: string;
  updatedData: EditProfileFormSchemaType;
}) {
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

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...updatedData,
        location: capitalize(updatedData.location ?? ""),
        name: capitalize(updatedData.name),
        lastName: capitalize(updatedData.lastName),
      },
    });
    return {
      success: {
        data: updatedUser,
        message: UpdateUserDetailEnum.USER_UPDATED,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        message: UpdateUserDetailEnum.FAILED_TO_UPDATE_USER,
      },
    };
  }
}

/**
 * this server action will update the profile picture only.
 *
 * it is created seperatly because updating the profile picture was not the part of form data.
 *
 * if user is not authenticated return the USER_NOT_LOGGED_IN response object.
 *
 * @param userId - The user Id
 * @param profilePicture - The user Profile picture Link
 * @returns
 */
export async function updateUserProfilePicture(
  userId: string,
  profilePicture: string,
) {
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

    const updatedProfilePicture = await prisma.user.update({
      where: { id: userId },
      data: { image: profilePicture },
    });
    return {
      success: {
        data: updatedProfilePicture,
        message: UpdateUserProfilePictureEnum.PROFILE_PICTURE_UPDATED,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        message: UpdateUserProfilePictureEnum.FAILED_TO_UPDATE_PROFILE_PICTURE,
      },
    };
  }
}
