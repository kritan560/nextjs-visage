"use server";

import { auth, signOut } from "@/auth";
import { LinkHomepage } from "@/links/links";
import prisma from "../../../prisma/prisma.db";
import { getUserProfilePicture } from "../visage/visage-server";
import { getUserDetailByIdEnum } from "./authentication-server-enums";

/**
 * This server action will return the profilePicture, userName, userId and isUserAuthenticated of a logged in user
 * @returns
 * @example
 * const {isUserAuthenticated,
    profilePicture,
    userName,
    userId,} = await getCurrentUser()
 */
export async function getCurrentUser() {
  const userStatus = await auth();

  // get the profile picture here so the whenever this is called the profile picture gets updated
  const isUserAuthenticated = !!userStatus;
  const profilePic = userStatus?.user.image;
  const userName = userStatus?.user.name;
  const userId = userStatus?.user.id;
  const userEmail = userStatus?.user.email;

  if (isUserAuthenticated) {
    const { success } = await getUserProfilePicture(userId);

    const userProfilePicture = success?.data?.image;
    const profilePicture = userProfilePicture ?? profilePic;

    return {
      isUserAuthenticated,
      profilePicture,
      userName,
      userId,
      userEmail,
    };
  } else {
    return {
      isUserAuthenticated,
      profilePic,
      userName,
      userId,
      userEmail,
    };
  }
}

/**
 * This server action will only return the isUserAuthenticataed, UserId and username. This action is created for sole purpose to reduce the DB calls made for profile picture.
 * @returns
 */
export async function getCurrentUserId() {
  const userStatus = await auth();

  // change the profile picture here so the whenever this is called the profile picture gets updated
  const isUserAuthenticated = !!userStatus;
  const userId = userStatus?.user?.id;
  const userName = userStatus?.user?.name;

  return {
    userId,
    userName,
    isUserAuthenticated
  };
}

/**
 * This server action will log the user out.
 */
export async function LogoutTheUser() {
  try {
    await signOut({ redirect: true, redirectTo: LinkHomepage });
  } catch (error) {
    console.error(error);
    throw new Error("something went wrong");
  }
}


/**
 * This server action will return the userDetail. it takes the UserId
 * @param userId
 * @returns
 */
export async function getUserDetailById(userId: string) {
  try {
    const { userId } = await getCurrentUserId();

    if (!userId) {
      return {
        failed: {
          data: null,
          message: getUserDetailByIdEnum.USER_NOT_LOGGED_IN,
        },
      };
    }

    const userDetail = await prisma.user.findUnique({ where: { id: userId } });
    return {
      success: {
        data: userDetail,
        message: getUserDetailByIdEnum.FOUND_USER_DETAIL,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        failed: getUserDetailByIdEnum.FAILED_TO_GET_USER_DETAIL,
      },
    };
  }
}
