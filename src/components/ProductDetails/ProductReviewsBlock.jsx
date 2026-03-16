import React, { useState } from "react";
import { Rating, Avatar } from "@mui/material";

const ProductReviewsBlock = ({ product }) => {
  const [viewAll, setViewAll] = useState(false);

  if (!product) return null;

  const reviews = product.reviews || [];
  const displayedReviews = viewAll ? reviews : reviews.slice(0, 3);

  return (
    <div className="product-reviews-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: 'var(--text-4xl)', fontWeight: 700, color: 'var(--text-primary)' }}>
          {product.ratings?.toFixed(1) || 0}
        </h2>
        <div>
          <Rating value={product.ratings || 0} precision={0.5} readOnly size="medium" />
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
            Based on {product.numOfReviews || 0} verified reviews
          </p>
        </div>
      </div>

      {reviews.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {displayedReviews.map((rev, i) => (
            <div
              key={i}
              style={{
                padding: '1.5rem',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Avatar sx={{ bgcolor: 'var(--accent-subtle)', color: 'var(--accent)', width: 32, height: 32, fontSize: '0.875rem' }}>
                  {rev.name?.charAt(0) || 'U'}
                </Avatar>
                <div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>{rev.name}</div>
                  <Rating value={rev.rating} readOnly size="small" precision={0.5} />
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                {rev.comment}
              </p>
            </div>
          ))}

          {reviews.length > 3 && (
            <button
              onClick={() => setViewAll(!viewAll)}
              className="btn btn-outline"
              style={{ alignSelf: 'center', marginTop: '1rem' }}
            >
              {viewAll ? "Show Less" : "View All Reviews"}
            </button>
          )}
        </div>
      ) : (
        <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-xl)' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No reviews yet. Be the first to share your experience!</p>
        </div>
      )}
    </div>
  );
};

export default ProductReviewsBlock;