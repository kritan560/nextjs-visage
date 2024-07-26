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
