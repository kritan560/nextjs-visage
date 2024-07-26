import { z } from "zod";

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
