import React from "react";

const ProductInfoBlock = ({ product }) => {
  if (!product || !product.specifications || product.specifications.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        No detailed specifications available for this product.
      </div>
    );
  }

  return (
    <div className="product-specs-container">
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-xl)',
        fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: '1.5rem'
      }}>
        Technical Specifications
      </h3>
      <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        {product.specifications.map((spec, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              padding: '1rem 1.5rem',
              borderBottom: i === product.specifications.length - 1 ? 'none' : '1px solid var(--border-subtle)',
              background: i % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-subtle)'
            }}
          >
            <div style={{ width: '35%', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
              {spec.title}
            </div>
            <div style={{ flex: 1, color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }}>
              {spec.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductInfoBlock;
