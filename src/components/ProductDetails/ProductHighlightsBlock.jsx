import React from "react";

const ProductHighlightsBlock = ({ product }) => {
  if (!product) return null;
  return (
    <div>
      <h3 className="text-lg font-bold text-[var(--primary-blue-dark)] mb-2">
        Product Details
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
        {product?.highlights?.map((highlight, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-[var(--primary-blue-light)] font-bold">
              •
            </span>
            <span className="text-[var(--primary-blue-dark)] text-sm">
              {highlight}
            </span>
          </div>
        ))}
        {product?.specifications?.map((spec, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-[var(--primary-blue-light)] font-bold">
              {spec.title}:
            </span>
            <span className="text-[var(--primary-blue-dark)] text-sm">
              {spec.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductHighlightsBlock;
