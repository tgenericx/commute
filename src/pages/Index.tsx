import { useEffect, useMemo, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@apollo/client/react';

import {
  FeedPostsDocument,
  type FeedPostsQuery,
  type FeedPostsQueryVariables,
  UpcomingEventsDocument,
  type UpcomingEventsQuery,
  type UpcomingEventsQueryVariables,
  MarketplaceListingsDocument,
  type MarketplaceListingsQuery,
  type MarketplaceListingsQueryVariables,
  MarketplaceInventoriesDocument,
  type MarketplaceInventoriesQuery,
  type MarketplaceInventoriesQueryVariables,
} from '../graphql/graphql';

import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import EventCard from '../components/EventCard';
import ProductCard from '../components/ProductCard';
import ListingCard from '../components/ListingCard';
import FloatingActionButton from '../components/FloatingActionButton';

// Temporary placeholders (remove these if real components exist)
const Skeleton = ({ style }: { style?: React.CSSProperties }) => (
  <div style={{ background: '#eee', borderRadius: 4, height: 20, ...style }} />
);

const Carousel = ({ children }: { children: React.ReactNode }) => (
  <div style={{ overflowX: 'auto', display: 'flex', gap: '1rem' }}>{children}</div>
);
const CarouselContent = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const CarouselItem = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

const Index = () => {
  const observerRef = useRef<HTMLDivElement | null>(null);

  // Feed posts
  const {
    data: postsData,
    loading: postsLoading,
    fetchMore,
    error: postsError,
  } = useQuery<FeedPostsQuery, FeedPostsQueryVariables>(FeedPostsDocument, {
    variables: { limit: 10 },
    notifyOnNetworkStatusChange: true,
  });

  // Upcoming events
  const {
    data: eventsData,
    error: eventsError,
  } = useQuery<UpcomingEventsQuery, UpcomingEventsQueryVariables>(UpcomingEventsDocument, {
    variables: { take: 5 },
  });

  // Marketplace listings
  const {
    data: listingsData,
    error: listingsError,
  } = useQuery<MarketplaceListingsQuery, MarketplaceListingsQueryVariables>(MarketplaceListingsDocument, {
    variables: { take: 5 },
  });

  // Inventories
  const {
    data: inventoriesData,
    error: inventoriesError,
  } = useQuery<MarketplaceInventoriesQuery, MarketplaceInventoriesQueryVariables>(
    MarketplaceInventoriesDocument,
    {
      variables: { take: 5 },
    }
  );

  useEffect(() => {
    const errors = [postsError, eventsError, listingsError, inventoriesError];
    if (errors.some(Boolean)) console.warn('Some queries failed', errors);
  }, [postsError, eventsError, listingsError, inventoriesError]);

  const posts = postsData?.feedPosts?.items ?? [];
  const pageInfo = postsData?.feedPosts?.pageInfo;

  const handleLoadMore = useCallback(() => {
    if (pageInfo?.hasNextPage && fetchMore) {
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
  }, [pageInfo, fetchMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && handleLoadMore(),
      { threshold: 0.5 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [handleLoadMore]);

  // Randomized insertion points
  const { eventInsertIndex, marketInsertIndex } = useMemo(() => {
    const len = posts.length;
    const eventInsertIndex = Math.floor(Math.random() * (len - 5)) + 3;
    const marketInsertIndex = Math.min(len - 1, eventInsertIndex + 4 + Math.floor(Math.random() * 3));
    return { eventInsertIndex, marketInsertIndex };
  }, [posts.length]);

  const upcomingEvents = eventsData?.events ?? [];
  const marketplaceItems = [
    ...(listingsData?.listings ?? []),
    ...(inventoriesData?.inventories ?? []),
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-2xl mx-auto p-4">
        {postsLoading && !posts.length ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 8, padding: '1rem', marginBottom: '1rem' }}>
              <Skeleton style={{ height: 10, width: '50%' }} />
              <Skeleton style={{ height: 20, width: '80%', marginTop: 10 }} />
            </div>
          ))
        ) : (
          posts.map((post, index) => (
            <div key={post.id} style={{ marginBottom: '2rem' }}>
              <PostCard post={post} />

              {index === eventInsertIndex && upcomingEvents.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  viewport={{ once: true }}
                  style={{ background: '#fff', borderRadius: 8, padding: '1rem', marginTop: '1rem' }}
                >
                  <Carousel>
                    <CarouselContent>
                      {upcomingEvents.map((event) => (
                        <CarouselItem key={event.id}>
                          <EventCard event={event} />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </motion.div>
              )}

              {index === marketInsertIndex && marketplaceItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  viewport={{ once: true }}
                  style={{ background: '#fff', borderRadius: 8, padding: '1rem', marginTop: '1rem' }}
                >
                  <Carousel>
                    <CarouselContent>
                      {marketplaceItems.map((item) => (
                        <CarouselItem key={item.id}>
                          {'stock' in item ? (
                            <ProductCard product={item} />
                          ) : (
                            <ListingCard listing={item} />
                          )}
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </motion.div>
              )}
            </div>
          ))
        )}

        {pageInfo?.hasNextPage && (
          <div ref={observerRef} style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <div style={{ fontSize: 14, opacity: 0.7 }}>Loading more posts...</div>
            </motion.div>
          </div>
        )}
      </div>

      <FloatingActionButton />
    </div>
  );
};

export default Index;
