import React from "react";
import { MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "../ui/card";

interface PostCardFooterProps {
  onReply?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  onLike?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  onShare?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  likeCount?: number;
  replyCount?: number;
}

export const PostCardFooter: React.FC<PostCardFooterProps> = ({
  onReply,
  onShare,
  replyCount = 0,
}) => {
  return (
    <CardFooter className="flex items-center justify-between text-muted-foreground pt-2">
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 text-sm hover:text-primary"
      >
        <MessageCircle className="h-4 w-4" />
        {replyCount}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 text-sm hover:text-primary"
      >
        <Share2 className="h-4 w-4" />
      </Button>
    </CardFooter>
  );
};
