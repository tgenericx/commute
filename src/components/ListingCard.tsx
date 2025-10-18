import React from 'react';
import { MarketplaceListingsQuery } from '../graphql/graphql';

type Listing = MarketplaceListingsQuery['listings'][number];

const ListingCard: React.FC<{ listing: Listing }> = ({ listing }) => (
  <div
    style={{
      background: '#f9f9f9',
      borderRadius: 8,
      padding: '1rem',
      minWidth: 200,
    }}
  >
    <div style={{ fontWeight: 600 }}>{listing.title || 'Untitled Listing'}</div>
    <div style={{ fontSize: 12, opacity: 0.7 }}>
      Price: ${listing.price || 0}
    </div>
  </div>
);

export default ListingCard;
