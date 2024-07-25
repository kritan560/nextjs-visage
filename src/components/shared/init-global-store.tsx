"use client";

import {
  useGlobalAuthUserImagesIdstore,
  useGlobalCollectImageIdsStore,
  useGlobalCollectionNameStore,
  useGlobalImagesStore,
  useGlobalLikeImageStore,
  useGlobalPublicProfileDetailStore,
} from "@/global-states/visage-image-state";
import {
  useGlobalCollectVideosIds,
  useGlobalLikeVideosIds,
  useGlobalVideos,
} from "@/global-states/visage-video-state";
import { UniversalImagesType, UniversalVideosType } from "@/types/visage-type";
import { CollectionNames } from "@prisma/client";
import React, { useEffect } from "react";

type InitGlobalStoreProps = {
  children: React.ReactNode;
  likedImagesIds: string[] | undefined;
  universalImagesType: UniversalImagesType | null;
  collectionNames: CollectionNames[] | undefined;
  collectImagesIds: string[] | undefined;
  authUserImagesIds: string[] | undefined;
  publicProfilePictures:
    | {
        id: string;
        image: string | null;
      }[]
    | undefined;
  collectVideosIds: string[] | undefined;
  likedVideosIds: string[] | undefined;
  globalVideos: UniversalVideosType["videos"] | undefined;
};

export default function InitGlobalStore(props: InitGlobalStoreProps) {
  const {
    children,
    collectionNames,
    likedImagesIds,
    universalImagesType,
    collectImagesIds,
    authUserImagesIds,
    publicProfilePictures,
    collectVideosIds,
    likedVideosIds,
    globalVideos,
  } = props;

  const { setGlobalCollectionNames } = useGlobalCollectionNameStore();
  const { setGlobalLikedImageId } = useGlobalLikeImageStore();
  const { setGlobalImages: setPexelCuratedPhotos } = useGlobalImagesStore();
  const { setGlobalCollectImageId } = useGlobalCollectImageIdsStore();
  const { setAuthUserImagesIds } = useGlobalAuthUserImagesIdstore();
  const { setPublicProfileDetail } = useGlobalPublicProfileDetailStore();
  const { setVideosIds } = useGlobalCollectVideosIds();
  const { setVideosIds: setGlobalLikedVideosIds } = useGlobalLikeVideosIds();
  const { setVideos: setGlobalVideos } = useGlobalVideos();

  useEffect(() => {
    setGlobalVideos(globalVideos);
  }, [globalVideos, setGlobalVideos]);

  useEffect(() => {
    setGlobalLikedVideosIds(likedVideosIds);
  }, [likedVideosIds, setGlobalLikedVideosIds]);

  useEffect(() => {
    setVideosIds(collectVideosIds);
  }, [collectVideosIds, setVideosIds]);

  useEffect(() => {
    if (publicProfilePictures) {
      setPublicProfileDetail(publicProfilePictures);
    }
  }, [publicProfilePictures, setPublicProfileDetail]);

  useEffect(() => {
    setGlobalCollectImageId(collectImagesIds);
  }, [collectImagesIds, setGlobalCollectImageId]);

  useEffect(() => {
    setAuthUserImagesIds(authUserImagesIds);
  }, [authUserImagesIds, setAuthUserImagesIds]);

  useEffect(() => {
    setGlobalLikedImageId(likedImagesIds);
  }, [likedImagesIds, setGlobalLikedImageId]);

  useEffect(() => {
    setPexelCuratedPhotos(universalImagesType);
  }, [universalImagesType, setPexelCuratedPhotos]);

  useEffect(() => {
    setGlobalCollectionNames(collectionNames);
  }, [setGlobalCollectionNames, collectionNames]);

  return <>{children}</>;
}
