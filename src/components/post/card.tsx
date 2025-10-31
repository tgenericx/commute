import React from "react";
import { Card } from "@/components/ui/card";
import { Post } from "@/graphql/graphql";
import { cn } from "@/lib/utils";
import { PostCardHeader } from "./card-header";
import { PostBody } from "./body";
import { PostCardFooter } from "./card-footer";
import { useSheetManager } from "@/contexts/sheet-manager";
import { toast } from "sonner";

interface PostCardProps {
  post: Post;
  className?: string;
  onPostClick?: (postId: string) => void;
  onOptionsClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * @default "default" - Standard rounded corners
   * "none" - Sharp edges for seamless background matching
   * "top" - Rounded top only (for first card in list)
   * "bottom" - Rounded bottom only (for last card in list)
   */
  corners?: "default" | "none" | "top" | "bottom";
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  className,
  onPostClick,
  onOptionsClick,
  corners = "default",
}) => {
  const { openSheet } = useSheetManager();

  const handleReply = React.useCallback(() => {
    openSheet("create-post", {
      parentId: post.id,
      mention: post.author.username,
    });
  }, [openSheet, post.id, post.author.username]);

  const handleShare = React.useCallback(() => {
    navigator.clipboard
      ?.writeText?.(window.location.href)
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch(() => {
        toast.message("Coming soon", {
          description: "This feature is coming soon, bear with us.",
        });
      });
  }, []);

  const handleCardClick = React.useCallback(
    (event: React.MouseEvent) => {
      const target = event.target as HTMLElement;
      const isInteractive = target.closest("button, a, [role='button']");

      if (!isInteractive && onPostClick) {
        onPostClick(post.id);
      }
    },
    [onPostClick, post.id],
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if ((event.key === "Enter" || event.key === " ") && onPostClick) {
        const target = event.target as HTMLElement;
        const isInteractive = target.closest("button, a, [role='button']");

        if (!isInteractive) {
          event.preventDefault();
          onPostClick(post.id);
        }
      }
    },
    [onPostClick, post.id],
  );

  const cornersClass = React.useMemo(() => {
    switch (corners) {
      case "none":
        return "rounded-none";
      case "top":
        return "rounded-t-lg rounded-b-none";
      case "bottom":
        return "rounded-b-lg rounded-t-none";
      default:
        return "rounded-lg";
    }
  }, [corners]);

  const hasClickAction = Boolean(onPostClick);

  return (
    <Card
      className={cn(
        "w-full shadow-none border transition-colors",
        hasClickAction && "hover:bg-muted/30 cursor-pointer",
        cornersClass,
        className,
      )}
      onClick={hasClickAction ? handleCardClick : undefined}
      role={hasClickAction ? "button" : undefined}
      tabIndex={hasClickAction ? 0 : undefined}
      onKeyDown={hasClickAction ? handleKeyDown : undefined}
      aria-label={
        hasClickAction ? `View post by ${post.author.name}` : undefined
      }
    >
      <PostCardHeader post={post} onOptionsClick={onOptionsClick} />
      <PostBody post={post} />
      <PostCardFooter
        replyCount={post._count?.replies ?? 0}
        onReply={handleReply}
        onShare={handleShare}
      />
    </Card>
  );
};
