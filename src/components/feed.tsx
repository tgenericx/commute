import React, { useEffect, useRef, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@apollo/client/react";
import FloatingActionButton from "@/components/FloatingActionButton";
import {
  FeedPostsDocument,
  type FeedPostsQuery,
  type FeedPostsQueryVariables,
  type Post,
} from "@/graphql/graphql";
import { PostCard } from "./post";

/**
 * Debounce hook for preventing rapid consecutive calls
 */
const useDebouncedCallback = (callback: () => void, delay: number) => {
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Clear the timeout when the component unmounts
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(callback, delay);
  }, [callback, delay]);
};

export const TimelinePost: React.FC = () => {
  const observerRef = useRef<HTMLDivElement | null>(null);

  // Use the generated query. Adjust variables if your codegen expects different names.
  const { data, loading, error, fetchMore, refetch } = useQuery<
    FeedPostsQuery,
    FeedPostsQueryVariables
  >(FeedPostsDocument, {
    variables: { limit: 10 },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (error) {
      // surface the GraphQL error in console for debugging
      console.warn("Feed posts query failed:", error);
    }
  }, [error]);

  // Keep raw GraphQL Post objects and sort by createdAt so the new PostCard (which
  // expects GraphQL Post) receives the exact shape it needs.
  const posts: Post[] = useMemo(() => {
    return (data?.feedPosts?.items ?? [])
      .filter((p): p is Post => Boolean(p && p.id))
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [data?.feedPosts?.items]);

  const pageInfo = data?.feedPosts?.pageInfo;

  // fetchMore wrapper that appends results using updateQuery
  const doFetchMore = useCallback(() => {
    if (!fetchMore || !pageInfo?.hasNextPage) return;
    fetchMore({
      variables: { after: pageInfo.endCursor, limit: 10 },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          feedPosts: {
            ...fetchMoreResult.feedPosts,
            items: [
              ...(prev.feedPosts?.items ?? []),
              ...(fetchMoreResult.feedPosts?.items ?? []),
            ],
          },
        };
      },
    }).catch((e) => {
      // fetchMore may throw network/GraphQL errors; log them for debugging
      console.error("fetchMore error:", e);
    });
  }, [fetchMore, pageInfo?.endCursor, pageInfo?.hasNextPage]);

  // Debounce calls from the observer
  const debouncedLoadMore = useDebouncedCallback(doFetchMore, 200);

  // Intersection observer: when sentinel is visible -> call fetchMore until hasNextPage is false
  useEffect(() => {
    if (!pageInfo?.hasNextPage || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          debouncedLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: "200px" },
    );

    const current = observerRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
      observer.disconnect();
    };
  }, [debouncedLoadMore, pageInfo?.hasNextPage, loading]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <div className="max-w-3xl mx-auto p-4 mt-8 space-y-8">
        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-destructive/10 border border-destructive rounded-lg p-4"
          >
            <p className="text-destructive mb-2">Failed to load posts</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
            <pre className="mt-2 text-xs text-muted-foreground">
              {/* Show brief error info for debugging; remove in prod */}
              {JSON.stringify(error, null, 2)}
            </pre>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 text-muted-foreground"
          >
            <div className="text-lg mb-2">No posts yet</div>
            <div className="text-sm">Be the first to create one!</div>
          </motion.div>
        )}

        {/* Loading Skeletons - Initial Load */}
        {loading && !posts.length && !error && (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-lg p-4 shadow-sm space-y-3 animate-pulse"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-muted" />
                  <div className="h-4 w-32 bg-muted" />
                </div>
                <div className="h-4 w-4/5 bg-muted" />
                <div className="h-3 w-3/4 bg-muted" />
                <div className="h-48 w-full rounded bg-muted" />
              </div>
            ))}
          </>
        )}

        {/* Posts List */}
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            viewport={{ once: true, margin: "50px" }}
          >
            {/* Pass the raw GraphQL Post into the new PostCard (it expects Post) */}
            <PostCard post={post} />
          </motion.div>
        ))}

        {/* Pagination Loading Indicator */}
        {loading && posts.length > 0 && (
          <div className="flex justify-center py-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-2 text-muted-foreground"
            >
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
              <span>Loading more posts...</span>
            </motion.div>
          </div>
        )}

        {/* Infinite Scroll Loader / Sentinel */}
        {pageInfo?.hasNextPage && (
          <div
            ref={observerRef}
            className="flex justify-center py-8 text-muted-foreground text-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              Scroll to load more
            </motion.div>
          </div>
        )}

        {/* End of Feed Message */}
        {!pageInfo?.hasNextPage && posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-muted-foreground text-sm"
          >
            You've reached the end of the feed
          </motion.div>
        )}
      </div>

      <FloatingActionButton />
    </div>
  );
};

export default TimelinePost;
