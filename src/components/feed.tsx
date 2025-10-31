import React from "react";
import { motion } from "framer-motion";
import FloatingActionButton from "@/components/FloatingActionButton";
import { PostCard } from "./post";
import { useInfiniteFeed } from "@/hooks/use-infinite-scroll";

export const TimelinePost: React.FC = () => {
  const {
    posts,
    loading,
    error,
    hasNextPage,
    observerRef,
    refetch,
    isFetchingMore,
  } = useInfiniteFeed();

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
            <PostCard post={post} />
          </motion.div>
        ))}

        {/* Pagination Loading Indicator */}
        {isFetchingMore && (
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
        {hasNextPage && (
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
        {!hasNextPage && posts.length > 0 && (
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
