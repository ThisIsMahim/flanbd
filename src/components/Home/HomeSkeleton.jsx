import React from "react";
import Skeleton, { ProductCardSkeleton } from "../common/Skeleton";

const HomeSkeleton = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Skeleton */}
      <div className="relative h-[80vh] bg-gray-50 flex items-center px-8 md:px-20">
        <div className="max-w-2xl w-full">
          <Skeleton variant="text" width="40%" height="20px" className="mb-6" />
          <Skeleton variant="text" width="90%" height="80px" className="mb-4" />
          <Skeleton variant="text" width="70%" height="80px" className="mb-8" />
          <div className="flex gap-4">
            <Skeleton variant="rounded" width="160px" height="48px" />
            <Skeleton variant="rounded" width="160px" height="48px" />
          </div>
        </div>
      </div>

      {/* Featured Products Skeleton */}
      <div className="py-20 px-8 md:px-20 max-w-[1400px] mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <Skeleton variant="text" width="120px" className="mb-4" />
            <Skeleton variant="text" width="300px" height="48px" />
          </div>
          <Skeleton variant="text" width="100px" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </div>
      </div>

      {/* Category Skeleton */}
      <div className="bg-gray-50 py-20 px-8 md:px-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <Skeleton variant="circular" width="80px" height="80px" className="mb-4" />
              <Skeleton variant="text" width="60px" />
            </div>
          ))}
        </div>
      </div>

      {/* Deal Slider Skeleton */}
      <div className="py-20 px-8 md:px-20 max-w-[1400px] mx-auto">
        <Skeleton variant="rounded" height="400px" />
      </div>
    </div>
  );
};

export default HomeSkeleton;
