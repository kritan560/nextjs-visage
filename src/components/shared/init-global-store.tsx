"use client";

import {
  useGlobalAuthUserImagesIdstore,
  useGlobalCollectImageIdsStore,
  useGlobalCollectionNameStore,
  useGlobalImagesStore,
  useGlobalLikeImageStore,
  useGlobalPublicProfileDetailStore,
} from "@/global-states/visage-image-state";
import { UniversalImagesType } from "@/types/visage-type";
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
  } = props;

  const { setGlobalCollectionNames } = useGlobalCollectionNameStore();
  const { setGlobalLikedImageId } = useGlobalLikeImageStore();
  const { setGlobalImages: setPexelCuratedPhotos } = useGlobalImagesStore();
  const { setGlobalCollectImageId } = useGlobalCollectImageIdsStore();
  const { setAuthUserImagesIds } = useGlobalAuthUserImagesIdstore();
  const { setPublicProfileDetail } = useGlobalPublicProfileDetailStore();

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
