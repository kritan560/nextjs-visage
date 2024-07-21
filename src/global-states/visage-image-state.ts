import { UniversalImagesType } from "@/types/visage-type";
import { CollectionNames, Images } from "@prisma/client";
import { create } from "zustand";

type CollectImageIdsType = {
  globalCollectImagesIds: string[] | undefined;
  setGlobalCollectImageId: (id: string[] | undefined) => void;
};
export const useGlobalCollectImageIdsStore = create<CollectImageIdsType>()(
  (set) => ({
    globalCollectImagesIds: [],
    setGlobalCollectImageId: (ids) => set({ globalCollectImagesIds: ids }),
  }),
);

/**
 *
 */
type LikeImageStoreType = {
  globalLikedImagesIds: string[] | undefined;
  setGlobalLikedImageId: (id: string[] | undefined) => void;
};
export const useGlobalLikeImageStore = create<LikeImageStoreType>()((set) => ({
  globalLikedImagesIds: [],
  setGlobalLikedImageId: (ids) => set({ globalLikedImagesIds: ids }),
}));

/**
 *
 */
type globalImagesType = {
  globalImages: UniversalImagesType | null;
  setGlobalImages: (globalImages: UniversalImagesType | null) => void;
};
export const useGlobalImagesStore = create<globalImagesType>()((set) => ({
  globalImages: [],
  setGlobalImages: (images) => set({ globalImages: images }),
}));

/**
 *
 */
type globalCollectionNameType = {
  globalCollectionNames: CollectionNames[] | undefined;
  setGlobalCollectionNames: (
    globalCollectionNames: CollectionNames[] | undefined,
  ) => void;
};
export const useGlobalCollectionNameStore = create<globalCollectionNameType>()(
  (set) => ({
    globalCollectionNames: undefined,
    setGlobalCollectionNames: (collectionNames) =>
      set({ globalCollectionNames: collectionNames }),
  }),
);

/**
 *
 */
type UploadImageDataType = {
  globalUploadImageDatas: Images[] | undefined;
  setglobalUploadImageDatas: (
    globalUploadImageDatas: Images[] | undefined,
  ) => void;
};
export const useGlobalUploadImageDataStore = create<UploadImageDataType>()(
  (set) => ({
    globalUploadImageDatas: undefined,
    setglobalUploadImageDatas: (collectionNames) =>
      set({ globalUploadImageDatas: collectionNames }),
  }),
);

/**
 *
 */
type AuthUserImagesIdsType = {
  authUserImagesIds: string[] | undefined;
  setAuthUserImagesIds: (authUserImagesIds: string[] | undefined) => void;
};
export const useGlobalAuthUserImagesIdstore = create<AuthUserImagesIdsType>()(
  (set) => ({
    authUserImagesIds: [],
    setAuthUserImagesIds: (authUserImagesIds) =>
      set({ authUserImagesIds: authUserImagesIds }),
  }),
);
