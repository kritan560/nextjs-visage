import { z } from "zod";

/**
 *
 */
export const NewPasswordFormSchema = z.object({
  password: z
    .string()
    .min(4, { message: "new password should be the length of 4 characters" }),
});
export type NewPasswordFormSchemaType = z.infer<typeof NewPasswordFormSchema>;
