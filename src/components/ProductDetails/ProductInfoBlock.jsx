import React from "react";
import StarIcon from "@mui/icons-material/Star";
import { getDiscount } from "../../utils/functions";
import OptimizedImg from "../common/OptimizedImg";

const ProductInfoBlock = ({
  product,
  currentSlide,
  setCurrentSlide,
  itemInCart,
  goToCart,
  addToCartHandler,
}) => {
  if (!product) return null;
  return (
    <div className="w-full flex flex-col items-center lg:items-start">
      {/* Main Product Image (no slider) */}
      <div className="w-full flex justify-center items-center mb-4">
        <OptimizedImg
          src={product.images?.[0]?.url || "/no-pictures.png"}
          alt={product.name}
          className="max-h-80 w-auto object-contain rounded-xl bg-[var(--primary-bg)] border border-[var(--primary-blue-light)]"
          quality="90"
          format="auto"
          placeholder="blur"
          priority={true}
        />
      </div>
      {product?.category && (
        <span className="text-xs font-bold uppercase text-[var(--primary-blue-light)] tracking-wide mb-1">
          {product.category}
        </span>
      )}
      <h1 className="text-2xl font-extrabold text-[var(--primary-blue-dark)] mb-2 leading-tight">
        {product?.name}
      </h1>
      {/* Stock Indicator Bar */}
      {/* {typeof product?.stock === "number" && (
        <div className="mb-3 flex items-center gap-2">
          <span
            className="text-sm font-bold"
            style={{
              color:
                product.stock === 5
                  ? "#e53935"
                  : product.stock <= 10
                  ? "#fbc02d"
                  : "var(--primary-blue-light)",
            }}
          >
            {product.stock < 1
              ? "Out of stock — we're restocking soon! Please check back later."
              : product.stock < 10
              ? product.stock === 1
                        ? "Hurry, Only 1 Sunglasses left!"
        : `Hurry, Only ${product.stock} Sunglasses left!`
              : product.stock === 1
                      ? "1 Sunglasses left"
        : `${product.stock} Sunglasses left`}
          </span>
          <div className="flex-1 h-2 rounded bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded transition-all duration-300"
              style={{
                width: `${Math.min(100, Math.max(10, product.stock * 10))}%`,
                display: product.stock < 1 ? "none" : "block",
                background:
                  product.stock < 1
                    ? "transparent"
                    : product.stock < 5
                    ? "#e53935"
                    : product.stock <= 10
                    ? "#fbc02d"
                    : "var(--primary-blue-light)",
              }}
            />
          </div>
        </div>
      )} */}
      <div className="flex items-center gap-3 mb-2">
        <span className="flex items-center gap-1 text-base font-bold text-[var(--primary-blue-light)]">
          {product?.ratings?.toFixed(1) || 0}
          <StarIcon sx={{ fontSize: 18, color: "var(--primary-blue-light)" }} />
        </span>
        <span className="text-sm text-[var(--primary-blue-dark)] font-medium">
          ({product?.numOfReviews || 0} reviews)
        </span>
      </div>
      <div className="flex items-baseline gap-3 mb-1">
        <span className="text-2xl font-bold text-[var(--primary-blue-dark)]">
          ৳{product?.price?.toLocaleString() || 0}
        </span>
        {product?.cuttedPrice && (
          <span className="text-lg text-gray-400 line-through">
            ৳{product.cuttedPrice.toLocaleString()}
          </span>
        )}
        {product?.price && product?.cuttedPrice && (
          <span className="text-base font-bold text-[var(--primary-blue-light)]">
            {getDiscount(product.price, product.cuttedPrice)}% off
          </span>
        )}
      </div>
      {/* Actions */}
      <div className="flex gap-3 my-4 w-full">
        {product?.stock > 0 && (
          <button
            onClick={itemInCart ? goToCart : addToCartHandler}
            className="flex-1 py-3 flex items-center justify-center gap-2 rounded-full bg-[var(--button-bg)] text-white font-bold border border-[var(--primary-blue-light)] hover:bg-[var(--primary-blue-dark)] hover:text-white transition-all"
          >
            {itemInCart ? "GO TO CART" : "ADD TO CART"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductInfoBlock;
