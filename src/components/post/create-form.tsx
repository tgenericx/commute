import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useMutation } from "@apollo/client/react";
import {
  CreatePostDocument,
  CreatePostMutation,
  CreatePostMutationVariables,
} from "@/graphql/graphql";
import { useRegisterSheet } from "@/hooks/use-register-sheet";
import React from "react";

const schema = z.object({
  textContent: z
    .string()
    .trim()
    .min(1, "Post content is required")
    .max(500, "Post must be under 500 characters"),
});

type FormValues = z.infer<typeof schema>;

const CreatePostForm = ({
  onClose,
  parentId,
  mention,
}: {
  onClose: () => void;
  parentId?: string;
  mention?: string;
}) => {
  const [mutate, { loading, error }] = useMutation<
    CreatePostMutation,
    CreatePostMutationVariables
  >(CreatePostDocument);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { textContent: mention ? `@${mention} ` : "" },
    mode: "onSubmit",
  });

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    textareaRef.current?.focus();
    if (mention) {
      const len = form.getValues("textContent").length;
      textareaRef.current?.setSelectionRange(len, len);
    }
  }, [mention]);

  const onSubmit = async (values: FormValues) => {
    try {
      await mutate({
        variables: {
          data: {
            ...values,
            parent: parentId ? { connect: { id: parentId } } : undefined,
          },
        },
      });
      form.reset();
      onClose();
    } catch (err) {
      console.error("Failed to create post:", err);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
      {parentId && mention && (
        <div className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-md text-sm">
          Replying to <span className="font-medium">@{mention}</span>
        </div>
      )}

      <div>
        <textarea
          placeholder="What's on your mind?"
          {...form.register("textContent")}
          disabled={loading}
          ref={textareaRef}
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
        {loading ? "Posting..." : parentId ? "Reply" : "Create Post"}
      </Button>
    </form>
  );
};

export const CreatePostSheet = () => {
  useRegisterSheet("create-post", ({ parentId, mention }, onClose) => (
    <CreatePostForm onClose={onClose} parentId={parentId} mention={mention} />
  ));
  return null;
};
