import InitGlobalStore from "@/components/shared/init-global-store";
import {
  getPexelCuratedPhotosByPage_PerPage,
  getVideos,
} from "@/servers/pexel/pexel-server";
import {
  getAllImages,
  getAuthUserUploadedImageId,
  getCollectVideosIds,
  getCollectionImagesIds,
  getCollectionNames,
  getLikedImages,
  getLikedVideosIds,
  getPublicProfilePictures,
} from "@/servers/visage/visage-server";
import React from "react";

type ImageLayoutProps = {
  children: React.ReactNode;
  contents: React.ReactNode;
};

export default async function ImageLayout(props: ImageLayoutProps) {
  const { children, contents } = props;

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
  const { success: getCollectVideosIdsSuccess } = await getCollectVideosIds();
  const { success: getLikedVideosIdsSuccess } = await getLikedVideosIds();
  const { success: getVideosSuccess } = await getVideos();

  const publicProfilePictures = publicProfilePicturesSuccess?.data;
  const likedImages = likedImagesSuccess?.data;
  const collectionNames = collectionNameSuccess?.data;
  const collectionImagesIds = collectionImagesIdsSuccess?.data;
  const collectVideosIds = getCollectVideosIdsSuccess?.data;
  const likedVideosIds = getLikedVideosIdsSuccess?.data;
  const globalVideos = getVideosSuccess?.data.videos;

  // !!! this maps can be done in server and values can be returned
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
      collectVideosIds={collectVideosIds}
      likedVideosIds={likedVideosIds}
      globalVideos={globalVideos}
    >
      {children}
      {contents}
    </InitGlobalStore>
  );
}
