import React from "react";
import { CardFooter } from "../ui/card";
import { ReplyButton } from "./actions/reply";
import { ShareButton } from "./actions/share";

interface PostCardFooterProps {
  onReply?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  onShare?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  replyCount?: number;
}

export const PostCardFooter: React.FC<PostCardFooterProps> = ({
  onReply,
  onShare,
  replyCount = 0,
}) => {
  return (
    <CardFooter className="flex items-center justify-between text-muted-foreground pt-2">
      <ReplyButton count={replyCount} onClick={onReply} />
      <ShareButton onClick={onShare} />
    </CardFooter>
  );
};
