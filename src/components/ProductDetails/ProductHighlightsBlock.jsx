import React from "react";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const ProductHighlightsBlock = ({ highlights }) => {
  if (!highlights || highlights.length === 0) return null;

  return (
    <div className="product-highlights-box mt-4 p-4 md:p-6 bg-gray-50 border border-gray-100 rounded-xl">
      <h3 className="font-display text-lg md:text-xl font-bold mb-3 md:mb-4 uppercase tracking-wider text-primary">
        Key Features
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 md:gap-y-3 gap-x-4 md:gap-x-6">
        {highlights.map((highlight, i) => (
          <div key={i} className="flex items-start gap-2 group">
            <CheckCircleOutlineIcon sx={{ fontSize: 16, color: 'var(--accent)', mt: '2px', flexShrink: 0 }} />
            <span className="text-xs md:text-sm text-secondary leading-relaxed group-hover:text-primary transition-colors">
              {highlight}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductHighlightsBlock;
