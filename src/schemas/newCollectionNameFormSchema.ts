import { z } from "zod";

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
