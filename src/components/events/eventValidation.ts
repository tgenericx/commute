import { z } from "zod";

export const eventSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    location: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return new Date(data.endTime) > new Date(data.startTime);
      }
      return true;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );

export type EventFormData = z.infer<typeof eventSchema>;
