"use server";

import {
  AugmentImageIntoUniversalImage,
  AugmentImagesImageField,
  AugmentImagesIntoUniversalImages,
  AugmentLikedImageIntoUniversalImage,
  AugmentLikedImagesIntoUniversalImages,
} from "@/augment/augment";
import { DailyUploadCount } from "@/constants/constants";
import { LinkLikePage } from "@/links/links";
import { EditProfileFormSchemaType } from "@/schemas/schemas";
import { UniversalImageType, UniversalImagesType } from "@/types/visage-type";
import { capitalize } from "@/utility/utils";
import { Images } from "@prisma/client";
import { revalidatePath } from "next/cache";
import prisma from "../../../prisma/prisma.db";
import { getCurrentUserId } from "../authentication/authentication-server";
import {
  changeCollectionNameEnum,
  collectImageEnum,
  createImagesEnum,
  createTokenForUserAccountDeletionEnum,
  deleteAccountByUserIdEnum,
  deleteCollectionNameEnum,
  getCollectionImagesIdsEnum,
  getCollectionNameByIdEnum,
  getDailyUploadCountEnum,
  getImageByIdEnum,
  getImagesEnum,
  getUserProfilePictureEnum,
  getTotalViewsCountEnum,
  updateUserDetailEnum,
  updateUserProfilePictureEnum,
} from "./visage-server-enum";

/**
 * This server action will only return the profile picture link.
 * @param userId
 * @returns
 */
export async function getUserProfilePicture(userId?: string) {
  try {
    const profilePicture = await prisma.user.findUnique({
      where: { id: userId },
      select: { image: true },
    });
    return {
      success: {
        data: profilePicture,
        message: getUserProfilePictureEnum.GOT_PROFILE_PICTURE,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        message: getUserProfilePictureEnum.FAILED_TO_GET_PROFILE_PICTURE,
      },
    };
  }
}

/**
 * it will remove, update or create the collectImageIds schema based on previousCollection.
 * @returns
 */
export async function collectImage(
  collectionName: string,
  image: UniversalImageType,
  collectionNameId?: string
) {
  try {
    const { userId } = await getCurrentUserId();

    if (!userId) {
      return {
        failed: { data: null, message: collectImageEnum.USER_NOT_LOGGED_IN },
      };
    }

    if (!collectionNameId) {
      const newCollectionName = await prisma.collectionNames.create({
        data: {
          collectionName,
          collectionImages: { set: [image] },
          userId,
        },
      });

      return {
        success: {
          data: newCollectionName,
          message: collectImageEnum.NEW_COLLECTION_CREATED,
        },
      };
    }

    const previousCollection = await prisma.collectionNames.findUnique({
      where: { id: collectionNameId },
    });

    const value = previousCollection?.collectionImages as unknown;
    const previousCollectionData = value as UniversalImagesType;

    const containImage = previousCollectionData.find(
      (img) => img.imageId == image.imageId
    );

    const updateData = previousCollectionData.filter(
      (data) => data.imageId != image.imageId
    );

    if (previousCollection && containImage) {
      const updateCollection = await prisma.collectionNames.update({
        where: { id: collectionNameId },
        data: {
          collectionName,
          userId,
          collectionImages: {
            set: updateData,
          },
        },
      });
      return {
        success: {
          data: updateCollection,
          message: collectImageEnum.COLLECTION_REMOVED,
        },
      };
    }

    const updateCollection = await prisma.collectionNames.update({
      where: { id: collectionNameId },
      data: {
        collectionName,
        userId,
        collectionImages: { push: [image] },
      },
    });
    return {
      success: {
        data: updateCollection,
        message: collectImageEnum.COLLECTION_UPDATED,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: { data: null, message: collectImageEnum.COLLECTION_IMAGE_FAILED },
    };
  }
}

/**
 * This server action takes the image of UniversalImageType add it to the liked image for the logged in user. when clicked and removes when clicked again.
 * @param image
 * @returns
 */
export async function likeImage(image: UniversalImageType) {
  try {
    const { userId } = await getCurrentUserId();

    if (!userId) {
      return {
        failed: { data: null, redirect: true, message: "User not logged in" },
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
          message: "Image unliked",
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
        message: "Image Liked",
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        redirect: false,
        message: "failed to create like photo",
      },
    };
  }
}

/**
 * This server action gets all the liked images of authenticated user.
 * @returns
 */
export async function getLikedImages() {
  try {
    const { userId } = await getCurrentUserId();

    if (!userId) {
      return { failed: { data: null, message: "user not logged in" } };
    }

    const collectPhotos = await prisma.likedImages.findMany({
      where: { userId },
    });

    const augmentedLikeImage =
      AugmentLikedImagesIntoUniversalImages(collectPhotos);
    return {
      success: {
        data: augmentedLikeImage,
        message: "got the success photo",
      },
    };
  } catch (error) {
    console.error(error);
    return { failed: { data: null, message: "failed to get like photo" } };
  }
}

/**
 * This server action returns all the collection names of logged in user
 * @returns
 */
export async function getCollectionNames() {
  try {
    const { userId } = await getCurrentUserId();
    const collectionName = await prisma.collectionNames.findMany({
      where: { userId },
    });

    const collectionNamesSorted = collectionName.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );

    return {
      success: {
        data: collectionNamesSorted,
        message: "collection name retrived",
      },
    };
  } catch (error) {
    console.error(error);
    return {
      error: { data: null, message: "failed to retrive collection name" },
    };
  }
}

/**
 * This server action will return all the collectionIds. CollectionIds are inside the collectonName it will loop through the collection names and return the collectionIds.
 * @returns
 */
export async function getCollectionImagesIds() {
  try {
    const { userId } = await getCurrentUserId();

    if (!userId) {
      return {
        failed: {
          data: null,
          message: getCollectionImagesIdsEnum.USER_NOT_LOGGED_IN,
        },
      };
    }

    let collectionNamesIds: string[] = [];
    const ids = await prisma.collectionNames.findMany({ where: { userId } });
    ids.map((id) =>
      (id.collectionImages as UniversalImagesType).map((id) =>
        collectionNamesIds.push(id.imageId)
      )
    );

    return {
      success: {
        data: collectionNamesIds,
        message: getCollectionImagesIdsEnum.COLLECTION_NAMES_IDS,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        message:
          getCollectionImagesIdsEnum.FAILED_TO_RETRIVE_COLLECTION_NAME_IDS,
      },
    };
  }
}

/**
 *
 */
export async function getImageById(id: string) {
  try {
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
          message: getImageByIdEnum.USER_IMAGE,
        },
      };
    }
    return {
      failed: { data: null, message: getImageByIdEnum.FAILED_TO_GET_IMAGE },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: { data: null, message: getImageByIdEnum.FAILED_TO_GET_IMAGE },
    };
  }
}

/**
 * return the user uploaded images.
 */
export async function getImages() {
  try {
    const { userId } = await getCurrentUserId();

    if (!userId) {
      return {
        failed: {
          data: null,
          message: getImagesEnum.USER_NOT_LOGGED_IN,
        },
      };
    }

    const images = await prisma.images.findMany({ where: { userId } });

    const augmentedImages = AugmentImagesIntoUniversalImages(images);
    return {
      success: {
        data: augmentedImages,
        message: getImagesEnum.USER_IMAGES,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        message: getImagesEnum.FAILED_TO_GET_IMAGES,
      },
    };
  }
}

/**
 * This server action will return the collectionName via collectionId.
 * @param collectionNameId
 * @returns
 */
export async function getCollectionNameById(collectionNameId: string) {
  try {
    const collectionName = await prisma.collectionNames.findUnique({
      where: { id: collectionNameId },
    });

    if (collectionName) {
      return {
        success: {
          data: collectionName,
          message: getCollectionNameByIdEnum.COLLECTION_NAMES_RETRIVED,
        },
      };
    }
    return {
      success: {
        data: null,
        message: getCollectionNameByIdEnum.COLLECTION_NOT_FOUND,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        message:
          getCollectionNameByIdEnum.FAILED_TO_RETRIVE_COLLECTION_NAME_BY_ID,
      },
    };
  }
}

/**
 * This server action will change the collectionName via collectionId
 * @param collectionId
 * @param newCollectionName
 * @returns
 */
export async function changeCollectionName(
  collectionId: string,
  newCollectionName: string
) {
  try {
    const updateCollectionName = await prisma.collectionNames.update({
      where: { id: collectionId },
      data: { collectionName: newCollectionName },
    });

    return {
      success: {
        data: updateCollectionName,
        message: changeCollectionNameEnum.COLLECTION_NAME_CHANGED,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        message: changeCollectionNameEnum.FAILED_TO_CHANGE_COLLECTION_NAME,
      },
    };
  }
}

/**
 * This server action will delete the collection name via collectionId
 * @param collectionId
 * @returns
 */
export async function deleteCollectionName(collectionId: string) {
  try {
    const updateCollectionName = await prisma.collectionNames.delete({
      where: { id: collectionId },
    });
    return {
      success: {
        data: updateCollectionName,
        message: deleteCollectionNameEnum.COLLECTION_NAME_DELETED,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        message: deleteCollectionNameEnum.FAILED_TO_DELETE_COLLECTION_NAME,
      },
    };
  }
}

/**
 * This server action will create the token for account deletion if token expired it will update the token when requested. NOTE: mail is sent in via frontend logic using SendEmail server action
 * @param userId
 * @returns
 */
export async function createTokenForUserAccountDeletion(userId: string) {
  try {
    const newToken = crypto.randomUUID();

    const updatedUserWithToken = await prisma.user.update({
      where: { id: userId },
      data: {
        userAccountDeletionToken: {
          upsert: {
            where: { userId },
            create: { token: newToken },
            update: { token: newToken },
          },
        },
      },
      include: { userAccountDeletionToken: true },
    });

    return {
      success: {
        data: updatedUserWithToken,
        message: createTokenForUserAccountDeletionEnum.TOKEN_CREATED,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        message: createTokenForUserAccountDeletionEnum.FAILED_TO_CREATE_TOKEN,
      },
    };
  }
}

/**
 * this server action will update the userDetail profile picture is not included here because it was not the part of form data.
 * @param param0
 * @returns
 */
export async function updateUserDetail({
  userId,
  updatedData,
}: {
  userId: string;
  updatedData: EditProfileFormSchemaType;
}) {
  try {
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
        message: updateUserDetailEnum.USER_UPDATED,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        message: updateUserDetailEnum.FAILED_TO_UPDATE_USER,
      },
    };
  }
}

/**
 * this server action will update the profile picture only. it is created seperatly because updating the profile picture was not the part of form data.
 * @param userId
 * @param profilePicture
 * @returns
 */
export async function updateUserProfilePicture(
  userId: string,
  profilePicture: string
) {
  try {
    const updatedProfilePicture = await prisma.user.update({
      where: { id: userId },
      data: { image: profilePicture },
    });
    return {
      success: {
        data: updatedProfilePicture,
        message: updateUserProfilePictureEnum.PROFILE_PICTURE_UPDATED,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        message: updateUserProfilePictureEnum.FAILED_TO_UPDATE_PROFILE_PICTURE,
      },
    };
  }
}

/**
 * This server action will delete the account. It seaerch the account via token if token is expired the account will not be deleted you have to request new token and again have to go through process to delete an account.
 * @param token
 * @returns
 */
export async function deleteAccountByUserId(token: string) {
  try {
    const userAccountDeletionToken =
      await prisma.userAccountDeletionToken.findUnique({
        where: { token: token },
      });

    if (!userAccountDeletionToken) {
      return {
        failed: {
          data: null,
          message: deleteAccountByUserIdEnum.TOKEN_NOT_FOUND,
        },
      };
    }

    const userId = userAccountDeletionToken.userId;
    const currentDate = new Date();
    const tokenExpiredIn24Hour = 1 * 24 * 60 * 60 * 1000;

    const tokenExpired =
      currentDate.getTime() >=
      userAccountDeletionToken?.createdAt.getTime() + tokenExpiredIn24Hour;

    if (tokenExpired) {
      return {
        failed: {
          data: null,
          message: deleteAccountByUserIdEnum.TOKEN_EXPIRED,
        },
      };
    }

    const deletedAccount = await prisma.user.delete({ where: { id: userId } });

    if (deletedAccount) {
      return {
        success: {
          data: deletedAccount,
          message: deleteAccountByUserIdEnum.ACCOUNT_DELETED,
        },
      };
    }

    return {
      failed: {
        data: null,
        message: deleteAccountByUserIdEnum.FAILED_TO_DELETE_ACCOUNT,
      },
    };
  } catch (error) {
    console.error(error);

    return {
      failed: {
        data: null,
        message: deleteAccountByUserIdEnum.FAILED_TO_DELETE_ACCOUNT,
      },
    };
  }
}

/**
 * This server action will perform checks for dailyUploadCount and create images if daily count not exceed.
 */
export async function createImages(images: Images[]) {
  const augmentedImages = AugmentImagesImageField(images);
  try {
    const { userId } = await getCurrentUserId();

    if (!userId) {
      return {
        failed: {
          data: null,
          message: createImagesEnum.USER_NOT_LOGGED_IN,
        },
      };
    }

    const { success } = await getDailyUploadCount();
    if (success) {
      const dailyUploadCount = success.data;
      const dailyUploadCountLimit = DailyUploadCount;

      // checks to ensure the daily upload limit won't exceed.
      if (images.length + dailyUploadCount > dailyUploadCountLimit) {
        return {
          failed: {
            data: null,
            message: `${
              createImagesEnum.DAILY_COUNT_EXCEDDED
            } Upload Limit Left : ${dailyUploadCountLimit - dailyUploadCount}`,
          },
        };
      }
    }

    const newImages = await prisma.images.createMany({
      data: augmentedImages,
    });
    return {
      success: { data: newImages, message: createImagesEnum.IMAGE_CREATED },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        message: createImagesEnum.FAILED_TO_CREATE_IMAGES,
      },
    };
  }
}

/**
 * This server action will return the number of images uploaded in a 24 hr interval
 */
export async function getDailyUploadCount() {
  try {
    const today = new Date();
    const a24hrBefore = new Date().getTime() - 86400000;
    const aDayBefore = new Date(a24hrBefore);

    // find all uploaded images between 24 hr interval.
    const dailyUploadCount = await prisma.images.findMany({
      where: { createdAt: { gte: aDayBefore, lte: today } },
    });
    return {
      success: {
        data: dailyUploadCount.length,
        message: getDailyUploadCountEnum.UPLOAD_COUNT,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        message: getDailyUploadCountEnum.FAILED_TO_GET_UPLOAD_COUNT,
      },
    };
  }
}

/**
 *
 */
export async function getTotalViewsCount() {
  try {
    const { userId } = await getCurrentUserId();
    if (!userId) {
      return {
        failed: { data: null, message: getTotalViewsCountEnum.USER_NOT_LOGGED_IN },
      };
    }

    const totalViews = await prisma.images.findMany({
      where: {
        userId: userId,
      },
      select: { views: true },
    });

    const views = totalViews.reduce((prev, current) => {
      return current.views ?? 0 + prev;
    }, 0);

    return { success: { data: views, message: getTotalViewsCountEnum.FOUND_VIEWS } };
  } catch (error) {
    return { failed: { data: null, message: getTotalViewsCountEnum.FOUND_VIEWS } };
  }
}