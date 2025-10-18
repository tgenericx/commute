import React from 'react';
import { MarketplaceInventoriesQuery } from '../graphql/graphql';

type Product = MarketplaceInventoriesQuery['inventories'][number];

const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
  <div
    style={{
      background: '#f8f8f8',
      borderRadius: 8,
      padding: '1rem',
      minWidth: 200,
    }}
  >
    <div style={{ fontWeight: 600 }}>{product.title || 'Unnamed Product'}</div>
    <div style={{ fontSize: 12, opacity: 0.7 }}>Stock: {product.stock}</div>
  </div>
);

export default ProductCard;
