import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@apollo/client/react";
import {
  CreateEventDocument,
  CreateEventMutation,
  CreateEventMutationVariables,
} from "@/graphql/graphql";
import { useRegisterSheet } from "@/hooks/use-register-sheet";

const schema = z.object({
  title: z.string().min(1, "Event title is required"),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  location: z.string().min(1, "Location is required"),
});

type FormValues = z.infer<typeof schema>;

export const CreateEventForm = ({ onClose }: { onClose: () => void }) => {
  const [mutate, { loading }] = useMutation<
    CreateEventMutation,
    CreateEventMutationVariables
  >(CreateEventDocument);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    await mutate({ variables: { data: values } });
    onClose();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Input placeholder="Event title" {...form.register("title")} />
      <Input type="date" {...form.register("date")} />
      <Input type="time" {...form.register("startTime")} />
      <Input type="time" {...form.register("endTime")} />
      <Input placeholder="Location" {...form.register("location")} />{" "}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Creating..." : "Create Event"}{" "}
      </Button>{" "}
    </form>
  );
};

export const CreateEventSheet = () => {
  useRegisterSheet("create-event", (_, onClose) => (
    <CreateEventForm onClose={onClose} />
  ));
  return null;
};
