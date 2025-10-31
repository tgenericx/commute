import { useRegisterSheet } from "@/hooks/use-register-sheet";
import { CreatePostForm } from "./form";

export const CreatePostSheet = () => {
  useRegisterSheet("create-post", ({ parentId, mention }, onClose) => (
    <CreatePostForm
      onClose={onClose}
      parentId={parentId}
      mention={mention}
      onSuccess={() => console.log("Post created successfully!")}
    />
  ));
  return null;
};
