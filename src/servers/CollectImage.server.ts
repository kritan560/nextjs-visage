"use server";

import {
  UniversalImageType,
  UniversalImagesType,
} from "@/types/universalImage.type";
import { getCurrentUserId } from "./Authentication.server";
import { AuthFailedEnum } from "../enums/authentication-server-enums";
import prisma from "../../prisma/prisma.db";
import { CollectImageEnum } from "../enums/CollectImage.enum";

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
