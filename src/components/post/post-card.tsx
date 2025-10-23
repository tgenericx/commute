import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, Share2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import MediaGrid from "../media/grid";
import { PostMedia } from "@/graphql/graphql";
import { AdaptedMedia, adaptMedia } from "../media";
import { AdaptedPost } from "./types";

interface PostCardProps {
  post: AdaptedPost;
  className?: string;
  bordered?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, className, bordered }: PostCardProps) => {
  const borderStyle = bordered ? "border border-border dark:border-neutral-800" : "";
  const media = post.postMedia?.map((pm: PostMedia): AdaptedMedia => adaptMedia(pm.media)) ?? [];

  return (
    <Card className={cn("w-full bg-card hover:bg-muted/50 transition-colors", borderStyle, className)}>
      <CardHeader className="flex flex-row items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={post.author.avatar ?? undefined} />
          <AvatarFallback>
            {post.author.name?.[0] ?? post.author.username[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{post.author.name ?? post.author.username}</span>
            <span className="text-sm text-muted-foreground">
              @{post.author.username}
            </span>
            <span className="text-xs text-muted-foreground">
              • {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </span>
          </div>
          {post.textContent && (
            <p className="mt-1 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {post.textContent}
            </p>
          )}
        </div>
      </CardHeader>

      {post.postMedia && post.postMedia.length > 0 && (
        <CardContent className="pt-0">
          <MediaGrid media={media} rounded bordered />
        </CardContent>
      )}

      <CardFooter className="flex items-center justify-between text-muted-foreground pt-2">
        <Button variant="ghost" size="sm" className="gap-2 text-sm hover:text-primary">
          <MessageCircle className="h-4 w-4" />
          {post._count.replies ?? 0}
        </Button>
        <Button variant="ghost" size="sm" className="gap-2 text-sm hover:text-primary">
          <Share2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
export default PostCard;
