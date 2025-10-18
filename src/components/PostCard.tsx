import React from 'react';
import { FeedPostsQuery } from '../graphql/graphql';

type Post = FeedPostsQuery['feedPosts']['items'][number];

const PostCard: React.FC<{ post: Post }> = ({ post }) => (
  <div className="bg-white rounded-lg shadow p-4 mb-4">
    <div className="font-semibold text-gray-900">{post.author.username}</div>
    <div className="mt-2 text-gray-700">{post.textContent || 'No content'}</div>
    <div className="mt-3 text-xs text-gray-500">
      {new Date(post.createdAt).toLocaleString()}
    </div>
  </div>
);

export default PostCard;
