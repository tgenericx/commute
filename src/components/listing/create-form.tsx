import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@apollo/client/react";
import {
  ListItemDocument,
  ListItemMutation,
  ListItemMutationVariables,
} from "@/graphql/graphql";
import { useRegisterSheet } from "@/hooks/use-register-sheet";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  price: z.number().min(0, "Price must be positive"),
});

type FormValues = z.infer<typeof schema>;

export const CreateListingForm = ({ onClose }: { onClose: () => void }) => {
  const [mutate, { loading }] = useMutation<
    ListItemMutation,
    ListItemMutationVariables
  >(ListItemDocument);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      price: 0,
    },
  });

  const onSubmit = async (values: FormValues) => {
    const data = {
      title: values.title,
      price: values.price,
    };

    try {
      await mutate({ variables: { data } });
      onClose();
    } catch (error) {
      console.error("Error creating listing:", error);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col space-y-4"
    >
      <Input placeholder="Listing Title" {...form.register("title")} />

      <Input
        type="number"
        placeholder="Price"
        {...form.register("price", { valueAsNumber: true })}
      />

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Creating..." : "Create Listing"}
      </Button>
    </form>
  );
};

export const CreateListingSheet = () => {
  useRegisterSheet("create-listing", (_, onClose) => (
    <CreateListingForm onClose={onClose} />
  ));
  return null;
};
