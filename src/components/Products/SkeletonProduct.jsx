import React from "react";
import Skeleton from "@mui/material/Skeleton";

const SkeletonProduct = () => {
  return (
    <div className="slider-product-card" style={{ opacity: 0.6 }}>
      {/* Image skeleton */}
      <div className="slider-card-image">
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          sx={{ bgcolor: 'var(--bg-subtle)' }}
        />
      </div>

      {/* Info skeleton */}
      <div className="slider-card-info">
        <div className="w-full">
          <Skeleton variant="text" width="40%" height={20} sx={{ bgcolor: 'var(--bg-subtle)', mb: 1 }} />
          <Skeleton variant="text" width="90%" height={30} sx={{ bgcolor: 'var(--bg-subtle)', mb: 2 }} />

          <div className="flex gap-2 mb-4">
            <Skeleton variant="text" width="30%" height={24} sx={{ bgcolor: 'var(--bg-subtle)' }} />
            <Skeleton variant="text" width="20%" height={24} sx={{ bgcolor: 'var(--bg-subtle)' }} />
          </div>
        </div>

        {/* Buttons skeleton */}
        <div className="flex gap-2 w-full mt-auto">
          <Skeleton variant="circular" width={44} height={44} sx={{ bgcolor: 'var(--bg-subtle)' }} />
          <Skeleton variant="rectangular" width="100%" height={44} sx={{ bgcolor: 'var(--bg-subtle)', borderRadius: '22px' }} />
        </div>
      </div>
    </div>
  );
};

export default SkeletonProduct;
