import InitGlobalStore from "@/components/shared/init-global-store";
import { getPexelCuratedPhotosByPage_PerPage } from "@/servers/pexel/pexel-server";
import {
  getAuthUserUploadedImageId,
  getCollectionImagesIds,
  getCollectionNames,
  getLikedImages,
} from "@/servers/visage/visage-server";
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
  const { success: authUserUploadedImagesIds } =
    await getAuthUserUploadedImageId();

  const likedImages = likedImagesSuccess?.data;
  const likedImagesIds = likedImages?.map((likedImage) => likedImage.imageId);

  const collectionNames = collectionNameSuccess?.data;
  const collectionImagesIds = collectionImagesIdsSuccess?.data;
  const authUserImagesIds = authUserUploadedImagesIds?.data.map(
    (id) => id.imageId,
  );

  return (
    <InitGlobalStore
      collectImagesIds={collectionImagesIds}
      collectionNames={collectionNames}
      likedImagesIds={likedImagesIds}
      universalImagesType={universalImagesType}
      authUserImagesIds={authUserImagesIds}
    >
      {children}
      {image}
    </InitGlobalStore>
  );
}
