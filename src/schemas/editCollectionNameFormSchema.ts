import { z } from "zod";

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
