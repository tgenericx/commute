import React from "react";
import MediaGrid from "@/components/media/grid";
import { Post } from "@/graphql/graphql";
import { adaptPostMedia } from "../types";

interface PostMediaProps {
  post: Pick<Post, "postMedia">;
}

export const PostMedia: React.FC<PostMediaProps> = ({ post }) => {
  const media = adaptPostMedia(post.postMedia ?? []);

  if (!media.length) return null;

  return (
    <div>
      <MediaGrid media={media} rounded bordered className="overflow-hidden" />
    </div>
  );
};

export default PostMedia;
