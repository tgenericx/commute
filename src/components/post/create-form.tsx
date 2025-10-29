// src/components/post/create-form.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@apollo/client/react";
import {
  CreatePostDocument,
  CreatePostMutation,
  CreatePostMutationVariables,
} from "@/graphql/graphql";
import { useRegisterSheet } from "@/hooks/use-register-sheet";

const schema = z.object({
  textContent: z
    .string()
    .trim()
    .min(1, "Post content is required")
    .max(500, "Post must be under 500 characters"),
});

type FormValues = z.infer<typeof schema>;

const CreatePostForm = ({ onClose }: { onClose: () => void }) => {
  const [mutate, { loading, error }] = useMutation<
    CreatePostMutation,
    CreatePostMutationVariables
  >(CreatePostDocument);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { textContent: "" },
    mode: "onSubmit",
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await mutate({ variables: { data: values } });
      form.reset();
      onClose();
    } catch (err) {
      console.error("Failed to create post:", err);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
      <div>
        <Input
          placeholder="What's on your mind?"
          {...form.register("textContent")}
          disabled={loading}
        />
        {form.formState.errors.textContent && (
          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.textContent.message}
          </p>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500">
          {error.message || "Something went wrong. Please try again."}
        </p>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Posting..." : "Create Post"}
      </Button>
    </form>
  );
};

export const CreatePostSheet = () => {
  useRegisterSheet("create-post", (_, onClose) => (
    <CreatePostForm onClose={onClose} />
  ));
  return null;
};
