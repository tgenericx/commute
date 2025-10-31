import React, { useState } from "react";
import Linkify from "linkify-react";
import { Post } from "@/graphql/graphql";
import { cn } from "@/lib/utils";

interface PostTextProps {
  post: Pick<Post, "textContent">;
  className?: string;
  /** Number of characters to show before truncation */
  previewLength?: number;
}

export const PostText: React.FC<PostTextProps> = ({
  post,
  className,
  previewLength = 280,
}) => {
  const [expanded, setExpanded] = useState(false);
  const text = post.textContent?.trim();

  if (!text) return null;

  const isLong = text.length > previewLength;

  return (
    <div
      className={cn(
        "text-sm text-foreground leading-relaxed break-words whitespace-pre-wrap",
        !expanded && "line-clamp-5",
        className,
      )}
    >
      <Linkify options={{ className: "text-primary hover:underline" }}>
        <>
          {text}
          {isLong && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="ml-1 text-primary font-medium hover:underline"
            >
              {expanded ? " Show less" : " Show more"}
            </button>
          )}
        </>
      </Linkify>
    </div>
  );
};
