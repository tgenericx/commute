import { z } from "zod";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const MAX_FILE_SIZE_MB = 50;
const MAX_FILES = 4;

export const mediaSchema = z
  .array(
    z
      .instanceof(File)
      .refine(
        (file: File): boolean => {
          const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
          const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
          return isImage || isVideo;
        },
        {
          message: "Unsupported file type",
        },
      )
      .refine(
        (file: File): boolean => file.size <= MAX_FILE_SIZE_MB * 1024 * 1024,
        {
          message: `File exceeds ${MAX_FILE_SIZE_MB}MB`,
        },
      ),
  )
  .max(MAX_FILES, { message: `Maximum ${MAX_FILES} files allowed` });

export type MediaSchemaType = z.infer<typeof mediaSchema>;
