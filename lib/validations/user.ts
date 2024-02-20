import * as z from "zod";

export const UserValidation = z.object({
  profile_photo: z.string().url().nonempty(),
  name: z
    .string()
    .min(3, { message: "Минимум 3 символа" })
    .max(30, { message: "Максимум 3 символа" }),
  username: z
    .string()
    .min(3, { message: "Минимум 3 символа" })
    .max(30, { message: "Максимум 3 символа" }),
  bio: z
    .string()
    .min(3, { message: "Минимум 3 символа" })
    .max(1000, { message: "Максимум 1000 символа" }),
});