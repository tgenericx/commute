import React from "react";
import { Card } from "@/components/ui/card";
import { Post } from "@/graphql/graphql";
import { cn } from "@/lib/utils";
import PostCardHeader from "./card-header";
import PostBody from "./body";
import { PostCardFooter } from "./card-footer";
import { useSheetManager } from "@/contexts/sheet-manager";
import { toast } from "sonner";

interface PostCardProps {
  post: Post;
  className?: string;
}

export const PostCard: React.FC<PostCardProps> = ({ post, className }) => {
  const { openSheet } = useSheetManager();
  const handleReply = () =>
    openSheet("create-post", {
      parentId: post.id,
      mention: post.author.username,
    });

  const handleShare = () =>
    toast.message("Comming soon", {
      description: "This feature is coming soon, bear with us.",
    });

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
        onReply={handleReply}
        onShare={handleShare}
      />
    </Card>
  );
};
