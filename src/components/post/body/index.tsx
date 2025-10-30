import React from "react";
import { CardContent } from "@/components/ui/card";
import { Post } from "@/graphql/graphql";
import { PostText } from "./text";
import { PostMedia } from "./media";

interface PostBodyProps {
  post: Pick<Post, "textContent" | "postMedia">;
}

export const PostBody: React.FC<PostBodyProps> = ({ post }) => {
  const hasText = !!post.textContent?.trim();
  const hasMedia = !!(post.postMedia && post.postMedia.length);

  if (!hasText && !hasMedia) return null;

  return (
    <CardContent className="p-4 space-y-3">
      {hasText && <PostText post={post} />}
      {hasMedia && <PostMedia post={post} />}
    </CardContent>
  );
};

export default PostBody;
