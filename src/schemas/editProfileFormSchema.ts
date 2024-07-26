import { z } from "zod";

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
