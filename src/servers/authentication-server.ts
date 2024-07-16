"use server";

import { auth } from "@/auth";
import { getUserProfilePicture } from "./visage-server";

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

  // change the profile picture here so the whenever this is called the profile picture gets updated
  const profilePic = userStatus?.user.image;
  const userName = userStatus?.user.name;
  const userId = userStatus?.user.id;
  const isUserAuthenticated = !!userStatus;
  const userEmail = userStatus?.user.email;

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
}

/**
 * This server action will only return the UserId and username. This action is created for sole purpose to reduce the DB calls made for profile picture.
 * @returns
 */
export async function getCurrentUserId() {
  const userStatus = await auth();

  // change the profile picture here so the whenever this is called the profile picture gets updated
  const userId = userStatus?.user?.id;
  const userName = userStatus?.user?.name;

  return {
    userId,
    userName,
  };
}
