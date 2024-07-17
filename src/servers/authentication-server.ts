"use server";

import { auth, signOut } from "@/auth";
import { LinkHomepage } from "@/links/links";
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

/**
 * This server action will log the user out.
 */
export async function LogoutTheUser() {
  try {
    await signOut({ redirect: true, redirectTo: LinkHomepage });
  } catch (error) {
    console.log(error);
    throw new Error("something went wrong");
  }
}
