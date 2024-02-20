import * as z from "zod";

export const ChirpValidation = z.object({
  chirp: z.string().nonempty().min(3, { message: "Minimum 3 characters." }),
  accountId: z.string(),
});

export const CommentValidation = z.object({
  chirp: z.string().nonempty().min(3, { message: "Minimum 3 characters." }),
});