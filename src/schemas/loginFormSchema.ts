import { z } from "zod";

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
