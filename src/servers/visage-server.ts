import { UniversalImageType, UniversalImagesType } from "@/types/visage-type";
import prisma from "../../prisma/prisma.db";
import {
  collectImageEnum,
  getUserProfilePictureEnum,
} from "./visage-server-enum";
import { getCurrentUserId } from "./authentication-server";
import { revalidatePath } from "next/cache";
import { LinkLikePage } from "@/links/links";
import { AugmentLikedImageIntoUniversalImage } from "@/augment/augment";

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

    const { id, totalResult, ...likeImageSchemaData } = image;
    const collectedPhoto = await prisma.likedImages.create({
      data: {
        ...likeImageSchemaData,
        likedImage: image,
        userId,
      },
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
