import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getDiscount } from "../../../../utils/functions";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../../actions/wishlistAction";
import OptimizedImg from "../../../common/OptimizedImg";

const ProductCard = ({
  product,
  isProductInCart,
  addToCartHandler,
  goToCartHandler,
  handleQuickView,
  subcategory,
}) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const itemInWishlist = wishlistItems.some((i) => i.product === product._id);
  const [isHovered, setIsHovered] = useState(false);

  const mainImage = product.images?.[0]?.url || "/no-pictures.png";
  const hoverImage = product.images?.[1]?.url;

  const handleWishlistClick = () => {
    if (itemInWishlist) {
      dispatch(removeFromWishlist(product._id));
      enqueueSnackbar("Removed from Wishlist", { variant: "success" });
    } else {
      dispatch(addToWishlist(product._id));
      enqueueSnackbar("Added to Wishlist", { variant: "success" });
    }
  };

  const hasDiscount = product.cuttedPrice && product.price < product.cuttedPrice;
  const discountPercent = hasDiscount ? getDiscount(product.price, product.cuttedPrice) : 0;

  return (
    <div className="slider-product-card group">
      {/* Image */}
      <div
        className="slider-card-image"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={`/product/${product._id}`}>
          <OptimizedImg
            src={isHovered && hoverImage ? hoverImage : mainImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>

        {/* Discount Badge */}
        {hasDiscount && (
          <span className="slider-discount-badge">-{discountPercent}%</span>
        )}

        {/* Action Icons */}
        <div className="slider-card-actions">
          <button
            className={`slider-icon-btn ${itemInWishlist ? 'active text-accent' : ''}`}
            aria-label={itemInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            onClick={handleWishlistClick}
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={itemInWishlist ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button
            className="slider-icon-btn"
            aria-label="Quick View"
            onClick={() => handleQuickView(product)}
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="slider-card-info">
        <div className="flex flex-col gap-1">
          {subcategory && (
            <span className="slider-card-brand">{subcategory.name}</span>
          )}
          <Link to={`/product/${product._id}`}>
            <h3 className="slider-card-title group-hover:text-accent transition-colors duration-300">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="slider-card-price">
          <span className="current">৳{product.price?.toLocaleString() || 0}</span>
          {hasDiscount && (
            <span className="old">৳{product.cuttedPrice.toLocaleString()}</span>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
          <button
            className={`flex-1 py-2.5 px-4 rounded-md font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
              isProductInCart(product._id) 
                ? 'bg-green-600 text-white shadow-md' 
                : 'bg-black text-white hover:bg-[#FF1837] shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
            onClick={() => isProductInCart(product._id) ? goToCartHandler() : addToCartHandler(product._id)}
          >
            {isProductInCart(product._id) ? 'In Cart' : 'Add to Cart'}
          </button>
          <Link 
            to={`/product/${product._id}`}
            className="flex items-center justify-center w-11 h-11 rounded-md border border-gray-200 text-gray-600 hover:text-white hover:bg-[#FF1837] hover:border-[#FF1837] transition-all duration-300 shrink-0"
            title="View Details"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
