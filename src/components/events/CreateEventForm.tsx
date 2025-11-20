import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Modal } from "@/modal";
import { toast } from "sonner";
import { useCreateEvent } from "@/hooks/events/useEvents";
import { eventSchema } from "./eventValidation";
import { CreateEventMutation } from "@/graphql/graphql";

interface CreateEventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (event: CreateEventMutation["createEvent"]) => void;
}

export const CreateEventForm = ({
  isOpen,
  onClose,
  onSuccess,
}: CreateEventFormProps) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { createEvent, loading } = useCreateEvent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = eventSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const errorMap: Record<string, string> = {};
      Object.entries(fieldErrors).forEach(([key, value]) => {
        if (value && value[0]) {
          errorMap[key] = value[0];
        }
      });
      setErrors(errorMap);
      return;
    }

    try {
      const { data } = await createEvent({
        input: {
          title: formData.title,
          description: formData.description || undefined,
          startTime: new Date(formData.startTime),
          endTime: new Date(formData.endTime),
          location: formData.location || undefined,
          isPublic: true,
        },
      });

      if (data?.createEvent) {
        toast.success(
          `Event "${data.createEvent.title}" created successfully!`,
        );
        onSuccess(data.createEvent);
        onClose();
        setFormData(initialFormData);
        setErrors({});
      }
    } catch (error) {
      console.error("Create event error:", error);
      toast.error("Failed to create event");
    }
  };

  const handleFieldChange =
    (field: keyof typeof formData) => (value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="medium"
      isDismissable={true}
      showCloseButton={true}
    >
      <div className="py-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Create New Event</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Share your event with the community
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend className="sr-only">Event Information</FieldLegend>
              <FieldDescription className="sr-only">
                Enter the details for your new event
              </FieldDescription>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="event-title">Event Title</FieldLabel>
                  <Input
                    id="event-title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleFieldChange("title")(e.target.value)}
                    placeholder="Team Standup, Workshop, Meetup..."
                    disabled={loading}
                    required
                  />
                  {errors.title && (
                    <FieldDescription className="text-destructive">
                      {errors.title}
                    </FieldDescription>
                  )}
                  <FieldDescription>
                    Choose a clear and descriptive title
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="event-description">
                    Description
                  </FieldLabel>
                  <Textarea
                    id="event-description"
                    value={formData.description}
                    onChange={(e) =>
                      handleFieldChange("description")(e.target.value)
                    }
                    placeholder="What's this event about? What will people learn or experience?"
                    disabled={loading}
                    rows={3}
                  />
                  {errors.description && (
                    <FieldDescription className="text-destructive">
                      {errors.description}
                    </FieldDescription>
                  )}
                  <FieldDescription>
                    Optional description for your event
                  </FieldDescription>
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="event-start-time">
                      Start Time
                    </FieldLabel>
                    <Input
                      id="event-start-time"
                      type="datetime-local"
                      value={formData.startTime}
                      onChange={(e) =>
                        handleFieldChange("startTime")(e.target.value)
                      }
                      disabled={loading}
                      required
                    />
                    {errors.startTime && (
                      <FieldDescription className="text-destructive">
                        {errors.startTime}
                      </FieldDescription>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="event-end-time">End Time</FieldLabel>
                    <Input
                      id="event-end-time"
                      type="datetime-local"
                      value={formData.endTime}
                      onChange={(e) =>
                        handleFieldChange("endTime")(e.target.value)
                      }
                      disabled={loading}
                      required
                    />
                    {errors.endTime && (
                      <FieldDescription className="text-destructive">
                        {errors.endTime}
                      </FieldDescription>
                    )}
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="event-location">Location</FieldLabel>
                  <Input
                    id="event-location"
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      handleFieldChange("location")(e.target.value)
                    }
                    placeholder="Online, Office, Community Park..."
                    disabled={loading}
                  />
                  {errors.location && (
                    <FieldDescription className="text-destructive">
                      {errors.location}
                    </FieldDescription>
                  )}
                  <FieldDescription>
                    Where will this event take place?
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </FieldSet>

            <Field orientation="horizontal" className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Creating..." : "Create Event"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </Modal>
  );
};

const initialFormData = {
  title: "",
  description: "",
  startTime: "",
  endTime: "",
  location: "",
};
