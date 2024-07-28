"use server";

import { UniversalImagesType } from "@/types/universalImage.type";
import prisma from "../../prisma/prisma.db";
import {
  ChangeCollectionNameEnum,
  DeleteCollectionNameEnum,
  GetCollectionNameByIdEnum,
  GetCollectionNamesEnum,
  GetCollectionNamesImagesIdsEnum,
} from "../enums/CollectionName.enum";
import { getCurrentUserId } from "./Authentication.server";
import { AuthFailedEnum } from "../enums/authentication-server-enums";

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
 *
 * @returns
 */
export async function getCollectionNameImagesIds() {
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
        message: GetCollectionNamesImagesIdsEnum.COLLECTION_NAMES_IDS,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      failed: {
        data: null,
        message:
          GetCollectionNamesImagesIdsEnum.FAILED_TO_RETRIVE_COLLECTION_NAME_IDS,
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
