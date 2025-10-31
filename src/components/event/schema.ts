import { mediaSchema } from "@/lib/validation/media.schema";
import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(1, "Event title is required"),
  description: z.string().min(20).optional(),
  files: mediaSchema.optional(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  location: z.string().min(1, "Location is required"),
});

export type CreateEventFormValues = z.infer<typeof createEventSchema>;
