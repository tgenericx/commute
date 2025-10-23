import { Post } from "@/graphql/graphql";
import { AdaptedPost } from "./types";

export function adaptPost(post: Post): AdaptedPost {
  return {
    id: post.id,
    textContent: post.textContent,
    createdAt: post.createdAt,
    _count: {
      postMedia: post._count.postMedia,
      replies: post._count?.replies
    },
    author: post.author,
    postMedia: post.postMedia?.filter(Boolean) ?? [],
  };
}
