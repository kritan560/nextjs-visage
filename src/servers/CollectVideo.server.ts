"use server";

import {
  UniversalVideoType,
  UniversalVideosType,
} from "@/types/universalVideo.type";
import prisma from "../../prisma/prisma.db";
import { getCurrentUserId } from "./Authentication.server";
import { AuthFailedEnum } from "../enums/authentication-server-enums";
import {
  CollectVideoEnum,
  CollectVideosIdsEnum,
} from "../enums/CollectVideo.enum";

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
