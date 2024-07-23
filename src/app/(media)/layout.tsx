import InitGlobalStore from "@/components/shared/init-global-store";
import { getPexelCuratedPhotosByPage_PerPage } from "@/servers/pexel/pexel-server";
import {
  getAllImages,
  getAuthUserUploadedImageId,
  getCollectionImagesIds,
  getCollectionNames,
  getLikedImages,
  getPublicProfilePictures,
} from "@/servers/visage/visage-server";
import React from "react";

type ImageLayoutProps = {
  children: React.ReactNode;
  image: React.ReactNode;
};

export default async function ImageLayout(props: ImageLayoutProps) {
  const { children, image } = props;

  const pexelCuratedPhotos =
    (await getPexelCuratedPhotosByPage_PerPage()) ?? [];
  const userUploadedImages = (await getAllImages()).success?.data ?? [];
  const { success: likedImagesSuccess } = await getLikedImages();
  const { success: collectionNameSuccess } = await getCollectionNames();
  const { success: collectionImagesIdsSuccess } =
    await getCollectionImagesIds();
  const { success: authUserUploadedImagesIds } =
    await getAuthUserUploadedImageId();
  const { success: publicProfilePicturesSuccess } =
    await getPublicProfilePictures();

  const publicProfilePictures = publicProfilePicturesSuccess?.data;
  const likedImages = likedImagesSuccess?.data;
  const collectionNames = collectionNameSuccess?.data;
  const collectionImagesIds = collectionImagesIdsSuccess?.data;

  const likedImagesIds = likedImages?.map((likedImage) => likedImage.imageId);
  const authUserImagesIds = authUserUploadedImagesIds?.data.map(
    (id) => id.imageId,
  );

  const universalImagesType = [...userUploadedImages, ...pexelCuratedPhotos];

  return (
    <InitGlobalStore
      collectImagesIds={collectionImagesIds}
      collectionNames={collectionNames}
      likedImagesIds={likedImagesIds}
      universalImagesType={universalImagesType}
      authUserImagesIds={authUserImagesIds}
      publicProfilePictures={publicProfilePictures}
    >
      {children}
      {image}
    </InitGlobalStore>
  );
}
