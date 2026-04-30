import React from "react";

const Skeleton = ({
  variant = "text", // text, circular, rectangular, rounded
  width,
  height,
  className = "",
  animate = true,
}) => {
  const baseStyles = "bg-gray-200 relative overflow-hidden";
  
  const variants = {
    text: "h-4 w-full rounded",
    circular: "rounded-full",
    rectangular: "rounded-none",
    rounded: "rounded-xl",
  };

  const animationClass = animate ? "after:absolute after:inset-0 after:-translate-x-full after:bg-gradient-to-r after:from-transparent after:via-white/50 after:to-transparent after:animate-[shimmer_2s_infinite]" : "";

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${animationClass} ${className}`}
      style={{
        width: width || (variant === "circular" ? "40px" : "100%"),
        height: height || (variant === "circular" ? "40px" : "auto"),
      }}
    />
  );
};

export default Skeleton;

// Specialized Skeletons for different UI patterns
export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
    <Skeleton variant="rounded" height="200px" className="mb-4" />
    <Skeleton variant="text" width="60%" className="mb-2" />
    <Skeleton variant="text" width="40%" className="mb-4" />
    <div className="flex justify-between items-center">
      <Skeleton variant="text" width="30%" height="24px" />
      <Skeleton variant="circular" width="32px" height="32px" />
    </div>
  </div>
);

export const TableRowSkeleton = ({ columns = 5 }) => (
  <div className="flex items-center gap-4 py-4 border-b border-gray-50">
    {[...Array(columns)].map((_, i) => (
      <Skeleton key={i} variant="text" />
    ))}
  </div>
);
