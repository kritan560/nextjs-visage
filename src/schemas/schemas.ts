import { z } from "zod";

/**
 * Image or video search keyword schema
 */
export const ImageOrVideoSearchKeywordSchema = z.object({
  searchedKeyword: z.string().min(1, {
    message: "enter the keyword",
  }),
});
export type ImageOrVideoSearchKeywordSchemaType = z.infer<
  typeof ImageOrVideoSearchKeywordSchema
>;

/**
 *
 */
export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Please enter the valid mail" }),
  password: z
    .string()
    .min(4, { message: "password should be the length of 4 characters" }),
});
export type LoginFormSchemaType = z.infer<typeof LoginFormSchema>;

/**
 *
 */
export const JoinFormSchema = z.object({
  firstName: z.string().min(1, { message: "Please enter the first name" }),
  lastName: z.string().min(1, { message: "Please enter the last name" }),
  email: z.string().email({ message: "Please enter the valid mail" }),
  password: z
    .string()
    .min(4, { message: "password should be the length of 4 characters" }),
});
export type JoinFormSchemaType = z.infer<typeof JoinFormSchema>;

/**
 *
 */
export const NewPasswordFormSchema = z.object({
  password: z
    .string()
    .min(4, { message: "new password should be the length of 4 characters" }),
});
export type NewPasswordFormSchemaType = z.infer<typeof NewPasswordFormSchema>;

/**
 *
 */
export const NewCollectionNameFormSchema = z.object({
  collectionName: z.string().min(2, {
    message: "Collection Name must be at least 2 characters.",
  }),
});
export type NewCollectionNameFormSchemaType = z.infer<
  typeof NewCollectionNameFormSchema
>;

/**
 *
 */
export const EditCollectionNameFormSchema = z.object({
  collectionName: z.string().min(2, {
    message: "Collection Name must be at least 2 characters.",
  }),
});
export type EditCollectionNameFormSchemaType = z.infer<
  typeof EditCollectionNameFormSchema
>;

/**
 *
 */
export const EditProfileFormSchema = z.object({
  name: z.string().min(2, {
    message: "First Name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email",
  }),
  publicEmail: z.string().optional(),
  shortBio: z
    .string()
    .optional()
    .refine((str) => {
      if (str && str?.length < 150) {
        return false;
      } else {
        return true;
      }
    }),
  location: z.string().optional(),
  webSite: z.string().optional(),
  x: z.string().optional(),
  instagram: z.string().optional(),
  youTube: z.string().optional(),
  tikTok: z.string().optional(),
});
export type EditProfileFormSchemaType = z.infer<typeof EditProfileFormSchema>;

/**
 *
 */
export const UploadImageFormSchema = z.object({
  title: z.string().optional(),
  tags: z.string().optional(),
  location: z.string().optional(),
});
export type UploadImageFormSchemaType = z.infer<typeof UploadImageFormSchema>;
