import { useEffect, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@apollo/client/react";
import Navbar from "@/components/Navbar";
import FloatingActionButton from "@/components/FloatingActionButton";
import PostCard from "@/components/post/post-card";
import {
  FeedPostsDocument,
  Post,
  type FeedPostsQuery,
  type FeedPostsQueryVariables,
} from "@/graphql/graphql";
import { AdaptedPost, adaptPost } from "@/components/post";

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-muted rounded ${className}`} />
);

// Debounce hook for preventing rapid consecutive calls
const useDebouncedCallback = (callback: () => void, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Fixed: added null as initial value

  return useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(callback, delay);
  }, [callback, delay]);
};

const Index = () => {
  const observerRef = useRef<HTMLDivElement | null>(null);

  const { data, loading, error, fetchMore, refetch } = useQuery<
    FeedPostsQuery,
    FeedPostsQueryVariables
  >(FeedPostsDocument, {
    variables: { limit: 10 },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (error) console.warn("Feed posts query failed:", error);
  }, [error]);

  // Memoize posts transformation
  const posts: AdaptedPost[] = useMemo(() => {
    return (data?.feedPosts?.items ?? [])
      .filter((p): p is NonNullable<typeof p> => p != null)
      .map((p) => adaptPost(p as unknown as Post))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [data?.feedPosts?.items]);

  const pageInfo = data?.feedPosts?.pageInfo;

  const handleLoadMore = useCallback(() => {
    if (pageInfo?.hasNextPage && fetchMore && !loading) {
      fetchMore({
        variables: { after: pageInfo.endCursor, limit: 10 },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            feedPosts: {
              ...fetchMoreResult.feedPosts,
              items: [...prev.feedPosts.items, ...fetchMoreResult.feedPosts.items],
            },
          };
        },
      });
    }
  }, [pageInfo, fetchMore, loading]);

  // Debounced load more to prevent rapid consecutive calls
  const debouncedLoadMore = useDebouncedCallback(handleLoadMore, 300);

  // Optimized intersection observer
  useEffect(() => {
    if (!pageInfo?.hasNextPage || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          debouncedLoadMore();
        }
      },
      { threshold: 0.1 } // Lower threshold for earlier loading
    );

    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [debouncedLoadMore, pageInfo?.hasNextPage, loading]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <Navbar />

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
              <div key={i} className="bg-card rounded-lg p-4 shadow-sm space-y-3">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-48 w-full rounded" />
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
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              <span>Loading more posts...</span>
            </motion.div>
          </div>
        )}

        {/* Infinite Scroll Loader */}
        {pageInfo?.hasNextPage && !loading && (
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

export default Index;
