import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";

const CategorySection = ({
  category,
  products,
  isProductInCart,
  addToCartHandler,
  goToCartHandler,
  handleQuickView,
  showSeeAll,
  onSeeAll,
}) => {
  const ViewAllButton = ({ label, onClick, to, compact = false }) => {
    const inner = (
      <span className="flex items-center gap-2">
        {label}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform">
          <path strokeLinecap="square" strokeLinejoin="miter" d="M9 5l7 7-7 7" />
        </svg>
      </span>
    );

    const baseClasses = "group inline-flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em] text-[#0f0f0f] border-b-2 border-black/10 hover:border-[#ff1837] pb-1 transition-all mt-4 md:mt-0";

    if (onClick) {
      return (
        <button onClick={onClick} className={baseClasses}>{inner}</button>
      );
    }
    return (
      <Link to={to} className={baseClasses}>{inner}</Link>
    );
  };

  if (!products || products.length === 0) return null;

  return (
    <div id={`category-${category._id}`} className="mb-20 last:mb-0 scroll-mt-32">
      <div className="bg-white">

        {/* Category Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between md:gap-5 mb-8">
          <div className="flex items-center gap-4 flex-1">
            <h3 className="text-xl md:text-3xl font-extrabold text-[#0f0f0f] uppercase tracking-tight">{category.name}</h3>
            <div className="h-[2px] flex-1 bg-gradient-to-r from-gray-100 to-transparent mt-2"></div>
          </div>

          {/* Direct main view all placed efficiently at top right on md+ screens */}
          {showSeeAll && (
            <div className="hidden md:block">
              <ViewAllButton
                label={`See All ${category.name}`}
                onClick={onSeeAll || undefined}
                to={`/products?category=${category.name}`}
                compact={true}
              />
            </div>
          )}
        </div>

        {/* Flat Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              isProductInCart={isProductInCart}
              addToCartHandler={addToCartHandler}
              goToCartHandler={goToCartHandler}
              handleQuickView={handleQuickView}
            />
          ))}
        </div>

        {/* Bottom View All for Generic Category (Mobile Fallback) */}
        {showSeeAll && (
          <div className="md:hidden flex justify-center mt-8">
            <ViewAllButton
              label={`Explore ${category.name}`}
              onClick={onSeeAll || undefined}
              to={`/products?category=${category.name}`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CategorySection;
