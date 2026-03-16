import React from "react";

const ProductHighlightsBlock = ({ highlights }) => {
  if (!highlights || highlights.length === 0) return null;

  return (
    <div className="product-highlights-box" style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)' }}>
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-lg)',
        fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: '1rem'
      }}>
        Product Highlights
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {highlights.map((highlight, i) => (
          <div key={i} className="flex items-center gap-2">
            <span style={{ color: 'var(--accent)', fontWeight: 900 }}>•</span>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              {highlight}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductHighlightsBlock;
