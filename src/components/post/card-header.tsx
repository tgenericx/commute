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
  const { author, createdAt } = post;

  const timeAgo = React.useMemo(() => {
    return createdAt
      ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
      : null;
  }, [createdAt]);

  const handleUserClick = React.useCallback(() => {
    openSheet("user-preview", { id: author.id });
  }, [openSheet, author.id]);

  const displayName = author?.name ?? author?.username;

  return (
    <CardHeader
      className={cn(
        "flex items-start justify-between p-4 pb-2 gap-3",
        className
      )}
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        {/* Avatar */}
        <UserAvatar
          user={{
            id: author.id,
            avatar: author.avatar,
            name: author.name,
            username: author.username,
          }}
          size="sm"
          onClick={handleUserClick}
        />

        {/* User info */}
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="ghost"
              onClick={handleUserClick}
              className="font-semibold leading-none text-sm hover:underline truncate p-0 h-auto focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {displayName}
            </Button>
            
            <span className="text-muted-foreground text-xs truncate flex-shrink-0">
              @{author?.username}
            </span>
            
            {timeAgo && (
              <>
                <span 
                  className="text-muted-foreground text-xs flex-shrink-0"
                  aria-hidden="true"
                >
                  ·
                </span>
                <time 
                  dateTime={createdAt}
                  className="text-muted-foreground text-xs select-none flex-shrink-0"
                >
                  {timeAgo}
                </time>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Options */}
      {onOptionsClick && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-full transition-colors flex-shrink-0"
          onClick={onOptionsClick}
          aria-label="Post options"
        >
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      )}
    </CardHeader>
  );
};

export default PostCardHeader;
