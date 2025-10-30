import React from "react";
import { Card } from "@/components/ui/card";
import { Post } from "@/graphql/graphql";
import { cn } from "@/lib/utils";
import PostCardHeader from "./card-header";
import PostBody from "./body";
import { PostCardFooter } from "./card-footer";

interface PostCardProps {
  post: Post;
  className?: string;
  onReply?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  onLike?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  onShare?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  className,
  onReply,
  onLike,
  onShare,
}) => {
  return (
    <Card
      className={cn(
        "w-full border-b rounded-none shadow-none hover:bg-muted/30 transition-colors",
        className,
      )}
    >
      <PostCardHeader post={post} />

      <PostBody post={post} />

      <PostCardFooter
        replyCount={post._count?.replies ?? 0}
        onReply={onReply}
        onLike={onLike}
        onShare={onShare}
      />
    </Card>
  );
};

export default PostCard;
