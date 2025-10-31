import { useEffect, useRef, useMemo, useCallback } from "react";
import { useQuery } from "@apollo/client/react";
import {
  FeedPostsDocument,
  type FeedPostsQuery,
  type FeedPostsQueryVariables,
  type Post,
} from "@/graphql/graphql";

/**
 * Debounce hook for preventing rapid consecutive calls
 */
const useDebouncedCallback = (callback: () => void, delay: number) => {
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
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

interface UseInfiniteFeedReturn {
  posts: Post[];
  loading: boolean;
  error: any;
  hasNextPage: boolean;
  observerRef: React.RefObject<HTMLDivElement | null>;
  refetch: () => void;
  isFetchingMore: boolean;
}

export const useInfiniteFeed = (): UseInfiniteFeedReturn => {
  const observerRef = useRef<HTMLDivElement | null>(null);

  const { data, loading, error, fetchMore, refetch } = useQuery<
    FeedPostsQuery,
    FeedPostsQueryVariables
  >(FeedPostsDocument, {
    variables: { limit: 10 },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
  });

  // Keep raw GraphQL Post objects and sort by createdAt
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
  const hasNextPage = Boolean(pageInfo?.hasNextPage);
  const isFetchingMore = loading && posts.length > 0;

  // fetchMore wrapper that appends results using updateQuery
  const doFetchMore = useCallback(() => {
    if (!fetchMore || !hasNextPage) return;
    fetchMore({
      variables: { after: pageInfo?.endCursor, limit: 10 },
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
      console.error("fetchMore error:", e);
    });
  }, [fetchMore, pageInfo?.endCursor, hasNextPage]);

  // Debounce calls from the observer
  const debouncedLoadMore = useDebouncedCallback(doFetchMore, 200);

  // Intersection observer: when sentinel is visible -> call fetchMore until hasNextPage is false
  useEffect(() => {
    if (!hasNextPage || loading) return;

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
  }, [debouncedLoadMore, hasNextPage, loading]);

  useEffect(() => {
    if (error) {
      console.warn("Feed posts query failed:", error);
    }
  }, [error]);

  return {
    posts,
    loading,
    error,
    hasNextPage,
    observerRef,
    refetch,
    isFetchingMore,
  };
};
