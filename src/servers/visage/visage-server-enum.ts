export enum CollectImageEnum {
  COLLECTION_IMAGE_FAILED = "COLLECTION_IMAGE_FAILED",
  NEW_COLLECTION_CREATED = "NEW_COLLECTION_CREATED",
  COLLECTION_UPDATED = "COLLECTION_UPDATED",
  COLLECTION_REMOVED = "COLLECTION_REMOVED",
}

export enum GetCollectionImagesIdsEnum {
  COLLECTION_NAMES_IDS = "COLLECTION_NAMES_IDS",
  FAILED_TO_RETRIVE_COLLECTION_NAME_IDS = "FAILED_TO_RETRIVE_COLLECTION_NAME_IDS",
}

export enum GetCollectionNameByIdEnum {
  FAILED_TO_RETRIVE_COLLECTION_NAME_BY_ID = "FAILED_TO_RETRIVE_COLLECTION_NAME_BY_ID",
  COLLECTION_NAMES_RETRIVED = "COLLECTION_NAMES_RETRIVED",
  COLLECTION_NOT_FOUND = "COLLECTION_NOT_FOUND",
}

export enum ChangeCollectionNameEnum {
  FAILED_TO_CHANGE_COLLECTION_NAME = "FAILED_TO_CHANGE_COLLECTION_NAME",
  COLLECTION_NAME_CHANGED = "COLLECTION_NAME_CHANGED",
}

export enum DeleteCollectionNameEnum {
  FAILED_TO_DELETE_COLLECTION_NAME = "FAILED_TO_DELETE_COLLECTION_NAME",
  COLLECTION_NAME_DELETED = "COLLECTION_NAME_DELETED",
}

export enum DeleteAccountByUserIdEnum {
  FAILED_TO_DELETE_ACCOUNT = "FAILED_TO_DELETE_ACCOUNT",
  ACCOUNT_DELETED = "ACCOUNT_DELETED",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  TOKEN_NOT_FOUND = "TOKEN_NOT_FOUND",
}

export enum CreateTokenForUserAccountDeletionEnum {
  FAILED_TO_CREATE_TOKEN = "FAILED_TO_CREATE_TOKEN",
  TOKEN_CREATED = "TOKEN_CREATED",
}

export enum UpdateUserDetailEnum {
  FAILED_TO_UPDATE_USER = "FAILED_TO_UPDATE_USER",
  USER_UPDATED = "USER_UPDATED",
}

export enum GetTotalViewsCountEnum {
  FAILED_TO_GET_VIEWS = "FAILED_TO_GET_VIEWS",
  FOUND_VIEWS = "FOUND_USER_DETAIL",
}

export enum UpdateUserProfilePictureEnum {
  FAILED_TO_UPDATE_PROFILE_PICTURE = "FAILED_TO_UPDATE_PROFILE_PICTURE",
  PROFILE_PICTURE_UPDATED = "PROFILE_PICTURE_UPDATED",
}

export enum GetUserProfilePictureEnum {
  FAILED_TO_GET_PROFILE_PICTURE = "FAILED_TO_GET_PROFILE_PICTURE",
  GOT_PROFILE_PICTURE = "GOT_PROFILE_PICTURE",
}

export enum CreateImagesEnum {
  FAILED_TO_CREATE_IMAGES = "FAILED_TO_CREATE_IMAGES",
  IMAGE_CREATED = "IMAGE_CREATED",
  DAILY_COUNT_EXCEDDED = "DAILY_COUNT_EXCEDDED",
}

export enum GetDailyUploadCountEnum {
  FAILED_TO_GET_UPLOAD_COUNT = "FAILED_TO_GET_UPLOAD_COUNT",
  UPLOAD_COUNT = "UPLOAD_COUNT",
}

export enum GetImagesEnum {
  FAILED_TO_GET_IMAGES = "FAILED_TO_GET_IMAGES",
  USER_IMAGES = "USER_IMAGES",
}

export enum GetImageByIdEnum {
  FAILED_TO_GET_IMAGE = "FAILED_TO_GET_IMAGE",
  USER_IMAGE = "USER_IMAGE",
}

export enum LikeImageEnum {
  IMAGE_LIKED = "IMAGE_LIKED",
  IMAGE_UNLIKED = "IMAGE_UNLIKED",
  FAILED_TO_LIKE_PHOTO = "FAILED_TO_LIKE_PHOTO",
}

export enum GetLikedImagesEnum {
  GOT_LIKED_PHOTO = "GOT_LIKED_PHOTO",
  FAILED_TO_GET_LIKED_PHOTO = "FAILED_TO_GET_LIKED_PHOTO",
}
export enum GetCollectionNamesEnum {
  GOT_COLLECTION_NAMES = "GOT_COLLECTION_NAMES",
  FAILED_TO_GET_COLLECTION_NAMES = "FAILED_TO_GET_COLLECTION_NAMES",
}

export enum GetImagesByTagsEnum {
  IMAGE_FOUND = "IMAGE_FOUND",
  FAILED_TO_GET_IMAGES = "FAILED_TO_GET_IMAGES",
}

export enum GetUserUploadedImageIdEnum {
  IMAGE_ID_FOUND = "IMAGE_ID_FOUND",
  FAILED_TO_GET_IMAGE_IDS = "FAILED_TO_GET_IMAGE_IDS",
}

export enum DeleteUserUploadedImageEnum {
  IMAGE_DELETED = "IMAGE_DELETED",
  FAILED_TO_DELETE_IMAGE = "FAILED_TO_DELETE_IMAGE",
}
