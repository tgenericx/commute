import React from 'react';
import { FeedPostsQuery } from '../graphql/graphql';

type Post = FeedPostsQuery['feedPosts']['items'][number];

const PostCard: React.FC<{ post: Post }> = ({ post }) => (
  <div
    style={{
      background: '#fff',
      borderRadius: 8,
      padding: '1rem',
      marginBottom: '1rem',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    }}
  >
    <div style={{ fontWeight: 'bold' }}>{post.author.username}</div>
    <div style={{ marginTop: 8 }}>{post.textContent || 'No content'}</div>
    <div style={{ fontSize: 12, opacity: 0.6, marginTop: 8 }}>
      {new Date(post.createdAt).toLocaleString()}
    </div>
  </div>
);

export default PostCard;
