"use server";

import {
  AugmentImageIntoUniversalImage,
  AugmentLikedImageIntoUniversalImage,
  AugmentLikedImagesIntoUniversalImages,
} from "@/augment/augment";
import { LinkLikePage } from "@/links/links";
import { UniversalImageType, UniversalImagesType } from "@/types/visage-type";
import { revalidatePath } from "next/cache";
import prisma from "../../prisma/prisma.db";
import { getCurrentUserId } from "./authentication-server";
import {
  collectImageEnum,
  getCollectionImagesIdsEnum,
  getImageByIdEnum,
  getUserProfilePictureEnum,
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

      revalidatePath(LinkLikePage);

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
        collectionNamesIds.push(String(id.id))
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
