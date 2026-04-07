import React from "react";

const ProductInfoBlock = ({ product }) => {
  if (!product || !product.specifications || product.specifications.length === 0) {
    return (
      <div className="py-12 text-center text-muted font-medium bg-subtle rounded-3xl">
        No detailed specifications available for this product.
      </div>
    );
  }

  return (
    <div className="product-specs-container max-w-4xl">
      <h3 className="font-display text-2xl font-bold mb-8 uppercase tracking-wide text-primary">
        Technical Details
      </h3>
      <div className="space-y-0 border border-border rounded-2xl overflow-hidden bg-surface">
        {product.specifications.map((spec, i) => (
          <div
            key={i}
            className={`flex flex-col sm:flex-row sm:items-center py-4 px-6 border-b border-border last:border-none transition-colors hover:bg-subtle/30 ${
              i % 2 === 0 ? "bg-surface" : "bg-subtle/10"
            }`}
          >
            <div className="w-full sm:w-1/3 font-bold text-primary text-xs uppercase tracking-wider mb-1 sm:mb-0">
              {spec.title}
            </div>
            <div className="flex-1 text-secondary text-sm font-medium leading-relaxed">
              {spec.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductInfoBlock;
