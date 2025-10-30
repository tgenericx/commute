import React from "react";
import { CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import { Post } from "@/graphql/graphql";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useSheetManager } from "@/contexts/sheet-manager";
import { UserAvatar } from "../user/avatar";

interface PostCardHeaderProps {
  post: Pick<Post, "author" | "createdAt">;
  onOptionsClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export const PostCardHeader: React.FC<PostCardHeaderProps> = ({
  post,
  onOptionsClick,
  className,
}) => {
  const { openSheet } = useSheetManager();
  const { author } = post;
  const timeAgo = post.createdAt
    ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
    : null;

  return (
    <CardHeader
      className={cn("flex items-start justify-between p-4 pb-2", className)}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <Button
          onClick={() => openSheet("user-preview", { id: author.id })}
          aria-label={`Open profile for ${author.name ?? author.username}`}
          className="focus:outline-none hover:opacity-90 transition-all duration-200"
        >
          <UserAvatar
            user={{
              id: author.id,
              avatar: author.avatar,
              name: author.name,
              username: author.username,
            }}
            size="sm"
          />
        </Button>

        {/* User info */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              onClick={() => openSheet("user-preview", { id: author.id })}
              className="font-semibold leading-none text-sm hover:underline truncate cursor-pointer focus:outline-none"
            >
              {author?.name ?? author?.username}
            </Button>
            <span className="text-muted-foreground text-xs truncate">
              @{author?.username}
            </span>
            {timeAgo && (
              <>
                <span className="text-muted-foreground text-xs">·</span>
                <span className="text-muted-foreground text-xs select-none">
                  {timeAgo}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Options */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-full transition"
        onClick={onOptionsClick}
      >
        <EllipsisVertical className="h-4 w-4" />
      </Button>
    </CardHeader>
  );
};

export default PostCardHeader;
