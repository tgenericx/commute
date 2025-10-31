import { z } from "zod";
import { mediaSchema } from "@/lib/validation/media.schema";

export const createPostSchema = z
  .object({
    textContent: z.string().trim().max(500).optional(),
    files: mediaSchema.optional(),
  })
  .refine(
    (data) =>
      (data.textContent && data.textContent.trim().length > 0) ||
      (data.files && data.files.length > 0),
    {
      message: "Either text content or at least one file is required",
    },
  );

export type CreatePostFormValues = z.infer<typeof createPostSchema>;
