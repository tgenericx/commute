import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { AutoResizeTextarea } from "./text-area";
import { MediaPicker } from "@/components/media/picker";
import { usePostForm } from "@/hooks/use-post-form";

interface CreatePostFormProps {
  onClose: () => void;
  parentId?: string;
  mention?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreatePostForm({
  onClose,
  parentId,
  mention,
  onSuccess,
  onCancel,
}: CreatePostFormProps) {
  const { form, onSubmit, isCreating, isUploading, progress, cancelUpload } =
    usePostForm({
      parentId,
      onSuccess,
      onCancel,
      onClose,
    });

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-xl mx-auto rounded-2xl border p-6 bg-background"
    >
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Create a Post</FieldLegend>
          {parentId && mention && (
            <div className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-md text-sm">
              Replying to <span className="font-medium">@{mention}</span>
            </div>
          )}
          <FieldDescription>
            Share what’s happening — text, photos, or videos.
          </FieldDescription>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="post-text">Caption</FieldLabel>
              <AutoResizeTextarea
                id="post-text"
                placeholder="What's happening?"
                disabled={isCreating || isUploading}
                {...form.register("textContent")}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="post-media">Add Media</FieldLabel>
              <MediaPicker
                disabled={isCreating || isUploading}
                onChange={(files) => form.setValue("files", files)}
              />
              {isUploading && (
                <div className="w-full h-1 bg-muted rounded mt-2 overflow-hidden">
                  <div
                    className="h-1 bg-primary transition-all duration-300"
                    style={{ width: `${progress ?? 0}%` }}
                  />
                </div>
              )}
            </Field>
          </FieldGroup>
        </FieldSet>

        <Field orientation="horizontal" className="justify-end mt-4 gap-2">
          {isUploading && (
            <Button type="button" variant="destructive" onClick={cancelUpload}>
              Cancel Upload
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isCreating || isUploading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isCreating || isUploading}>
            {isCreating || isUploading ? "Posting..." : "Post"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
