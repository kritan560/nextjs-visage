import InitGlobalStore from "@/components/init-global-store";
import { getPexelCuratedPhotosByPage_PerPage } from "@/servers/pexel-server";
import {
  getCollectionImagesIds,
  getCollectionNames,
  getLikedImages,
} from "@/servers/visage-server";
import React from "react";

type ImageLayoutProps = {
  children: React.ReactNode;
  image: React.ReactNode;
};

export default async function ImageLayout(props: ImageLayoutProps) {
  const { children, image } = props;

  const universalImagesType = await getPexelCuratedPhotosByPage_PerPage();
  const { success: likedImagesSuccess } = await getLikedImages();
  const { success: collectionNameSuccess } = await getCollectionNames();
  const { success: collectionImagesIdsSuccess } =
    await getCollectionImagesIds();

  const likedImages = likedImagesSuccess?.data;
  const likedImagesIds = likedImages?.map((likedImage) =>
    parseInt(likedImage.imageId)
  );

  const collectionNames = collectionNameSuccess?.data;
  const collectionImagesIds = collectionImagesIdsSuccess?.data;

  return (
    <InitGlobalStore
      collectImagesIds={collectionImagesIds}
      collectionNames={collectionNames}
      likedImagesIds={likedImagesIds}
      universalImagesType={universalImagesType}>
      {children}
      {image}
    </InitGlobalStore>
  );
}
