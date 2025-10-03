import Skeleton from "@mui/material/Skeleton";

const SkeletonProduct = () => {
  return (
    <div className="glass-card rounded-2xl shadow-lg overflow-hidden transition-all duration-300 relative border border-[var(--primary-blue-light)] flex flex-col" style={{ backgroundColor: 'var(--section-bg)', opacity: 0.6 }}>
      {/* Image skeleton */}
      <div className="w-full h-40 p-5 overflow-hidden relative flex items-center justify-center rounded-t-2xl" style={{ backgroundColor: 'var(--section-bg)', opacity: 0.7 }}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          className="rounded-xl"
          style={{ background: "var(--primary-bg)" }}
        />
      </div>
      <div className="w-full px-4 pt-3 pb-2 border-t border-[var(--primary-blue-light)] bg-gradient-to-b from-white/90 to-[var(--primary-bg)] rounded-b-2xl">
        <Skeleton variant="text" width={60} height={16} className="mb-1" />
        <Skeleton variant="text" width="80%" height={24} className="h-10" />
      </div>
      <div className="flex flex-col gap-1 w-full p-4 pt-0 relative z-20">
        {/* Rating and wishlist skeleton */}
        <div className="flex items-center justify-between mb-1 w-full">
          <Skeleton variant="rounded" width={60} height={20} />
          <Skeleton variant="circular" width={28} height={28} />
        </div>
        {/* Price and stock skeleton */}
        <div className="flex items-center justify-between w-full mt-1">
          <div className="flex flex-col gap-1">
            <Skeleton variant="text" width={80} height={20} />
            <Skeleton variant="text" width={50} height={14} />
          </div>
          <Skeleton variant="rounded" width={60} height={18} />
        </div>
        {/* Add to cart button skeleton */}
        <Skeleton
          variant="rectangular"
          width="100%"
          height={36}
          className="mt-3 rounded-full"
        />
      </div>
    </div>
  );
};

export default SkeletonProduct;
