import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation } from "@apollo/client/react";
import {
  CreatePostDocument,
  CreatePostMutation,
  CreatePostMutationVariables,
} from "@/graphql/graphql";
import { useUploadMedia } from "@/hooks/useUploadMedia";
import { MediaCreateInput } from "@/lib/mediaUtils";
import {
  CreatePostFormValues,
  createPostSchema,
} from "@/components/post/create/schema";

interface UsePostFormOptions {
  parentId?: string;
  mention?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export function usePostForm({
  parentId,
  onSuccess,
  onCancel,
  onClose,
}: UsePostFormOptions) {
  const form = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: { textContent: "", files: [] },
  });

  const { uploadMedia, isUploading, progress, cancelUpload } = useUploadMedia();
  const [createPostMutation, { loading: isCreating }] = useMutation<
    CreatePostMutation,
    CreatePostMutationVariables
  >(CreatePostDocument, { refetchQueries: ["FeedPosts"] });

  const handleSuccess = () => {
    form.reset();
    onSuccess?.();
    onCancel?.();
    onClose?.();
  };

  const onSubmit = async (data: CreatePostFormValues) => {
    const t = toast.loading("Creating post...");
    try {
      let uploadedMedia: MediaCreateInput[] = [];

      if (data.files?.length) {
        toast.loading("Uploading media...", { id: t });
        uploadedMedia = await uploadMedia(data.files);
        toast.loading("Finalizing post...", { id: t });
      }

      const payload = {
        data: {
          textContent: data.textContent?.trim() || null,
          parent: parentId ? { connect: { id: parentId } } : undefined,
          postMedia: uploadedMedia.length
            ? { create: uploadedMedia.map((m) => ({ media: { create: m } })) }
            : undefined,
        },
      };

      await createPostMutation({
        variables: payload,
        update(cache, { data }) {
          if (!data?.createPost) return;
          cache.modify({
            fields: {
              posts(existing = []) {
                return [data.createPost, ...existing];
              },
            },
          });
        },
      });

      toast.success("✅ Post created successfully!", { id: t });
      handleSuccess();
    } catch (error) {
      console.error("❌ CreatePost failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create post",
        { id: t },
      );
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isCreating,
    isUploading,
    progress,
    cancelUpload,
  };
}
