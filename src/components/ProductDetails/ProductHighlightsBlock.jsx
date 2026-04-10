import React from "react";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const ProductHighlightsBlock = ({ highlights }) => {
  if (!highlights || highlights.length === 0) return null;

  return (
    <div className="product-highlights-box">
      <h3>Key Features</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 mt-4">
        {highlights.map((highlight, i) => (
          <div key={i} className="flex items-center gap-3 group">
            <CheckCircleOutlineIcon sx={{ fontSize: 20 }} />
            <span className="text-sm font-semibold text-[#111] uppercase tracking-wide">
              {highlight}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductHighlightsBlock;
