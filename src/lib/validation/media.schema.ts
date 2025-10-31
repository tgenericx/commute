import { z } from "zod";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const MAX_FILE_SIZE_MB = 50;
const MAX_FILES = 4;

export const mediaSchema = z
  .array(
    z.instanceof(File).refine(
      (file) => {
        const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
        const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
        return isImage || isVideo;
      },
      (file) => ({
        message: `Unsupported file type: ${file.type}`,
      })
    ).refine(
      (file) => file.size <= MAX_FILE_SIZE_MB * 1024 * 1024,
      (file) => ({
        message: `${file.name} exceeds ${MAX_FILE_SIZE_MB}MB`,
      })
    )
  )
  .max(MAX_FILES, `Maximum ${MAX_FILES} files allowed`)
  .optional();

export type MediaSchemaType = z.infer<typeof mediaSchema>;
