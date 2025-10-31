import React from "react";
import { CardFooter } from "../ui/card";
import { ReplyButton } from "./actions/reply";
import { ShareButton } from "./actions/share";
import { cn } from "@/lib/utils";

interface PostCardFooterProps {
  onReply?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  onShare?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  replyCount?: number;
  className?: string;
}

export const PostCardFooter: React.FC<PostCardFooterProps> = ({
  onReply,
  onShare,
  replyCount = 0,
  className,
}) => {
  return (
    <CardFooter
      className={cn(
        "flex items-center justify-between text-muted-foreground px-4",
        className,
      )}
    >
      <ReplyButton count={replyCount} onClick={onReply} />
      <ShareButton onClick={onShare} />
    </CardFooter>
  );
};
