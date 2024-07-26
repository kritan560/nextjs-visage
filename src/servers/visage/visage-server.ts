"use server";

import {
  AugmentImageIntoUniversalImage,
  AugmentImagesImageField,
  AugmentImagesIntoUniversalImages,
  AugmentLikedImageIntoUniversalImage,
  AugmentLikedImagesIntoUniversalImages,
  AugmentLikedVideoIntoUniversalVideo,
  AugmentLikedVideosIntoUniversalVideos,
  AugmentVideoIntoUniversalvideoType,
} from "@/augment/augment";
import { DailyUploadCount } from "@/constants/constants";
import { LinkLikePage } from "@/links/links";
import { EditProfileFormSchemaType } from "@/schemas/schemas";
import {
  UniversalImageType,
  UniversalImagesType,
  UniversalVideoType,
  UniversalVideosType,
} from "@/types/visage-type";
import { capitalize } from "@/utility/utils";
import { Images } from "@prisma/client";
import { revalidatePath } from "next/cache";
import prisma from "../../../prisma/prisma.db";
import { getCurrentUserId } from "../authentication/authentication-server";
import { AuthFailedEnum } from "../authentication/authentication-server-enums";
import {
  ChangeCollectionNameEnum,
  CollectImageEnum,
  CollectVideoEnum,
  CollectVideosIdsEnum,
  CreateImagesEnum,
  CreateTokenForUserAccountDeletionEnum,
  DeleteAccountByUserIdEnum,
  DeleteCollectionNameEnum,
  DeleteUserUploadedImageEnum,
  DeleteUserUploadedVideoEnum,
  GetAllImagesEnum,
  GetCollectionImagesIdsEnum,
  GetCollectionNameByIdEnum,
  GetCollectionNamesEnum,
  GetDailyUploadCountEnum,
  GetImageByIdEnum,
  GetImagesByTagsEnum,
  GetImagesEnum,
  GetLikedImagesEnum,
  GetLikedVideosEnum,
  GetTotalViewsCountEnum,
  GetUserProfilePictureEnum,
  GetUserUploadedImageIdEnum,
  LikeImageEnum,
  LikeVideoEnum,
  UpdateUserDetailEnum,
  UpdateUserProfilePictureEnum,
} from "./visage-server-enum";

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
 * it will remove, update or create the collectImageIds schema based on previousCollection.
 *
 * if user is not authenticated return the USER_NOT_LOGGED_IN response object.
 * @param collectionName - The collection Name
 * @param collectionNameId - The collectionNames id
 * @param image - The universalImage
 * @returns
 */
export async function collectImage(
  collectionName: string,
  image: UniversalImageType,
  collectionNameId?: string,
) {
  try {
    const { userId } = await getCurrentUserId();

    if (!userId) {
      return {
        failed: { data: null, message: AuthFailedEnum.USER_NOT_LOGGED_IN },
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
          message: CollectImageEnum.NEW_COLLECTION_CREATED,
        },
      };
    }

    const previousCollection = await prisma.collectionNames.findUnique({
      where: { id: collectionNameId },
    });

    const value = previousCollection?.collectionImages as unknown;
    const previousCollectionData = value as UniversalImagesType;

    const containImage = previousCollectionData.find(
      (img) => img.imageId == image.imageId,
    );

    const updateData = previousCollectionData.filter(
      (data) => data.imageId != image.imageId,
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
          message: CollectImageEnum.COLLECTION_REMOVED,
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
        message: CollectImageEnum.COLLECTION_UPDATED,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: { data: null, message: CollectImageEnum.COLLECTION_IMAGE_FAILED },
    };
  }
}

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
 * This server action returns all the collection names of logged in user
 *
 * if user is not authenticated return the USER_NOT_LOGGED_IN response object.
 * @returns
 */
export async function getCollectionNames() {
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

    const collectionName = await prisma.collectionNames.findMany({
      where: { userId },
    });

    const collectionNamesSorted = collectionName.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );

    return {
      success: {
        data: collectionNamesSorted,
        message: GetCollectionNamesEnum.GOT_COLLECTION_NAMES,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      error: {
        data: null,
        message: GetCollectionNamesEnum.FAILED_TO_GET_COLLECTION_NAMES,
      },
    };
  }
}

/**
 * This server action will return all the collectionIds.
 *
 * CollectionIds are inside the collectonName it will loop through the collection names and return the collectionIds.
 *
 * if user is not authenticated return the USER_NOT_LOGGED_IN response object.
 * @returns
 */
export async function getCollectionImagesIds() {
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

    let collectionNamesIds: string[] = [];
    const ids = await prisma.collectionNames.findMany({ where: { userId } });
    ids.map((id) =>
      (id.collectionImages as UniversalImagesType).map((id) =>
        collectionNamesIds.push(id.imageId),
      ),
    );

    return {
      success: {
        data: collectionNamesIds,
        message: GetCollectionImagesIdsEnum.COLLECTION_NAMES_IDS,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        message:
          GetCollectionImagesIdsEnum.FAILED_TO_RETRIVE_COLLECTION_NAME_IDS,
      },
    };
  }
}

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
 * This server action will return the collectionName via collectionId.
 *
 * if user is not authenticated return the USER_NOT_LOGGED_IN response object.
 *
 * @param collectionNameId - The collectionName id
 * @returns
 */
export async function getCollectionNameById(collectionNameId: string) {
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
    const collectionName = await prisma.collectionNames.findUnique({
      where: { id: collectionNameId },
    });

    if (collectionName) {
      return {
        success: {
          data: collectionName,
          message: GetCollectionNameByIdEnum.COLLECTION_NAMES_RETRIVED,
        },
      };
    }
    return {
      success: {
        data: null,
        message: GetCollectionNameByIdEnum.COLLECTION_NOT_FOUND,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        message:
          GetCollectionNameByIdEnum.FAILED_TO_RETRIVE_COLLECTION_NAME_BY_ID,
      },
    };
  }
}

/**
 * This server action will change the collectionName via collectionId
 *
 * if user is not authenticated return the USER_NOT_LOGGED_IN response object.
 *
 * @param collectionId - The CollectionName id
 * @param newCollectionName - The new CollectionName
 * @returns
 */
export async function changeCollectionName(
  collectionId: string,
  newCollectionName: string,
) {
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

    const updateCollectionName = await prisma.collectionNames.update({
      where: { id: collectionId },
      data: { collectionName: newCollectionName },
    });

    return {
      success: {
        data: updateCollectionName,
        message: ChangeCollectionNameEnum.COLLECTION_NAME_CHANGED,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        message: ChangeCollectionNameEnum.FAILED_TO_CHANGE_COLLECTION_NAME,
      },
    };
  }
}

/**
 * This server action will delete the collection name via collectionId
 *
 * if user is not authenticated return the USER_NOT_LOGGED_IN response object.
 *
 * @param collectionId - The collection Id
 * @returns
 */
export async function deleteCollectionName(collectionId: string) {
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

    const updateCollectionName = await prisma.collectionNames.delete({
      where: { id: collectionId },
    });
    return {
      success: {
        data: updateCollectionName,
        message: DeleteCollectionNameEnum.COLLECTION_NAME_DELETED,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        message: DeleteCollectionNameEnum.FAILED_TO_DELETE_COLLECTION_NAME,
      },
    };
  }
}

/**
 * This server action will create the token for account deletion.
 *
 * if token expired it will update the token when requested.
 *
 * NOTE: mail is sent in via frontend logic using SendEmail server action
 *
 * if user is not authenticated return the USER_NOT_LOGGED_IN response object.
 *
 * @param userId
 * @returns
 */
export async function createTokenForUserAccountDeletion(userId: string) {
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
        message: CreateTokenForUserAccountDeletionEnum.TOKEN_CREATED,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        message: CreateTokenForUserAccountDeletionEnum.FAILED_TO_CREATE_TOKEN,
      },
    };
  }
}

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

/**
 * This server action will delete the account.
 *
 * It seaerch the account via token
 *
 * if token is expired the account will not be deleted
 *
 * you have to request new token and again have to go through process to delete an account.
 *
 * @param token - The token for an account
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
          message: DeleteAccountByUserIdEnum.TOKEN_NOT_FOUND,
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
          message: DeleteAccountByUserIdEnum.TOKEN_EXPIRED,
        },
      };
    }

    const deletedAccount = await prisma.user.delete({ where: { id: userId } });

    if (deletedAccount) {
      return {
        success: {
          data: deletedAccount,
          message: DeleteAccountByUserIdEnum.ACCOUNT_DELETED,
        },
      };
    }

    return {
      failed: {
        data: null,
        message: DeleteAccountByUserIdEnum.FAILED_TO_DELETE_ACCOUNT,
      },
    };
  } catch (error) {
    console.error(error);

    return {
      failed: {
        data: null,
        message: DeleteAccountByUserIdEnum.FAILED_TO_DELETE_ACCOUNT,
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
 * This server action will return the number of images uploaded in a 24 hr interval
 *
 * if user is not authenticated return the USER_NOT_LOGGED_IN response object.
 */
export async function getDailyUploadCount() {
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
        message: GetDailyUploadCountEnum.UPLOAD_COUNT,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        message: GetDailyUploadCountEnum.FAILED_TO_GET_UPLOAD_COUNT,
      },
    };
  }
}

/**
 * This server action will get the totalViewsCount and totalContent of currently loggedin User
 *
 * if user is not authenticated return the USER_NOT_LOGGED_IN response object.
 */
export async function getTotalViewsCount() {
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
 * This server action will get the videosIds that are saved in collection
 */
export async function getCollectVideosIds() {
  try {
    const { userId } = await getCurrentUserId();
    if (!userId) {
      return {
        failed: { data: null, message: AuthFailedEnum.USER_NOT_LOGGED_IN },
      };
    }

    const collectionNames = await prisma.collectionNames.findMany({
      where: { userId },
      select: { collectionVideos: true },
    });

    let collectionVideoIds: string[] = [];
    const collectionVideos = collectionNames.map(
      (collection) =>
        collection.collectionVideos as UniversalVideosType["videos"],
    );
    collectionVideos.map((cv) =>
      cv.map((data) => collectionVideoIds.push(data.videoId)),
    );

    return {
      success: {
        data: collectionVideoIds,
        message: CollectVideosIdsEnum.VIDEO_IDS_COLLECTED,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        message: CollectVideosIdsEnum.FAILED_TO_COLLECT_VIDEOS_IDS,
      },
    };
  }
}

/**
 * This server action will collect the videos and saved it into the collection.
 *
 * @param collectionName - The collection name
 * @param video - The video to save
 * @param collectionNameId - The collection id
 * @returns
 */
export async function collectVideo(
  collectionName: string,
  video: UniversalVideoType,
  collectionNameId?: string,
) {
  try {
    const { userId } = await getCurrentUserId();

    if (!userId) {
      return {
        failed: { data: null, message: AuthFailedEnum.USER_NOT_LOGGED_IN },
      };
    }

    if (!collectionNameId) {
      const newCollectionName = await prisma.collectionNames.create({
        data: {
          collectionName,
          collectionVideos: { set: [video] },
          userId,
        },
      });

      return {
        success: {
          data: newCollectionName,
          message: CollectVideoEnum.NEW_COLLECTION_CREATED,
        },
      };
    }

    const previousCollection = await prisma.collectionNames.findUnique({
      where: { id: collectionNameId },
    });

    const value = previousCollection?.collectionVideos as unknown;
    const previousCollectionData = value as UniversalVideosType["videos"];

    const containVideo = previousCollectionData.find(
      (vid) => vid.videoId == video.videoId,
    );

    const updateData = previousCollectionData.filter(
      (data) => data.videoId != video.videoId,
    );

    if (previousCollection && containVideo) {
      const updateCollection = await prisma.collectionNames.update({
        where: { id: collectionNameId },
        data: {
          collectionName,
          userId,
          collectionVideos: {
            set: updateData,
          },
        },
      });
      return {
        success: {
          data: updateCollection,
          message: CollectVideoEnum.COLLECTION_REMOVED,
        },
      };
    }

    const updateCollection = await prisma.collectionNames.update({
      where: { id: collectionNameId },
      data: {
        collectionName,
        userId,
        collectionVideos: { push: [video] },
      },
    });
    return {
      success: {
        data: updateCollection,
        message: CollectVideoEnum.COLLECTION_UPDATED,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: { data: null, message: CollectVideoEnum.COLLECTION_VIDEO_FAILED },
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
