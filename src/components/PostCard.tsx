import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MediaGrid from "@/components/media/grid";
import type { FeedPostsQuery } from "@/graphql/graphql";
import type { MiniMediaData } from "@/components/media/thumbnail";

type FeedPostItem = NonNullable<FeedPostsQuery["feedPosts"]>["items"][number];

interface PostCardProps {
  post: FeedPostItem;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const formattedDate = new Date(post.createdAt).toLocaleString();

  const flattenedMedia: MiniMediaData[] =
    post.postMedia?.map((pm) => ({
      id: pm.media.id,
      secureUrl: pm.media.secureUrl,
      resourceType: pm.media.resourceType,
    })) ?? [];

  return (
    <Card className="mb-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex items-center gap-3">
        <Avatar className="w-10 h-10">
          {post.author.avatar ? (
            <AvatarImage src={post.author.avatar} alt={post.author.username} />
          ) : (
            <AvatarFallback>
              {post.author.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <CardTitle className="text-base font-semibold">
            {post.author.username}
          </CardTitle>
          <p className="text-xs text-muted-foreground">{formattedDate}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {post.textContent && (
          <p className="text-gray-800 whitespace-pre-wrap break-words">
            {post.textContent}
          </p>
        )}

        {flattenedMedia.length > 0 && (
          <MediaGrid media={flattenedMedia} className="mt-2" />
        )}
      </CardContent>

      <CardFooter className="flex justify-between text-sm text-muted-foreground border-t pt-2">
        <button className="hover:text-blue-600 transition-colors">
          Like
        </button>
        <button className="hover:text-blue-600 transition-colors">
          Comment
        </button>
        <button className="hover:text-blue-600 transition-colors">
          Share
        </button>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
