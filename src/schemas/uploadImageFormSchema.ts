import { z } from "zod";

/**
 *
 */
export const UploadImageFormSchema = z.object({
  title: z.string().optional(),
  location: z.string().optional(),
});

export type UploadImageFormSchemaType = z.infer<typeof UploadImageFormSchema>;
