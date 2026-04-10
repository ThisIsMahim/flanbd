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
import { ShoppingBag, Eye, Heart } from 'lucide-react';

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

  const mainImage = product.images?.[0]?.url || "/no-pictures.png";

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
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
  const isNew = product.createdAt && (new Date() - new Date(product.createdAt)) < 7 * 24 * 60 * 60 * 1000;

  const categoryName = subcategory?.name || product.categories?.[0]?.name || (typeof product.categories?.[0] === 'string' ? product.categories[0] : null);

  const onCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isProductInCart && isProductInCart(product._id)) {
      goToCartHandler();
    } else {
      addToCartHandler(product._id);
    }
  };

  return (
    <div className="group flex flex-col h-full bg-white border border-transparent hover:border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden uppercase">
      {/* Image Container */}
      <Link to={`/product/${product._id}`} className="relative bg-[#f5f5f5] aspect-[4/5] overflow-hidden block">
        <OptimizedImg
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />

        {/* Subtle Hover Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badges Top Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {discountPercent > 0 ? (
            <span className="bg-[#ff1837] text-white text-[10px] font-extrabold px-2 py-0.5 tracking-widest shadow-sm">
              -{discountPercent}%
            </span>
          ) : isNew ? (
            <span className="bg-[#ff1837] text-white text-[10px] font-extrabold px-2 py-0.5 tracking-widest shadow-sm">
              NEW
            </span>
          ) : null}
        </div>

        {/* Actions Top Right */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
          <button
            className={`p-2 rounded-full bg-white/90 backdrop-blur-md shadow-sm transition-all duration-300 transform scale-0 group-hover:scale-100 focus:scale-100 active:scale-95 ${itemInWishlist ? 'text-[#ff1837]' : 'text-gray-900'} hover:bg-white`}
            onClick={handleWishlistClick}
            aria-label={itemInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={14} fill={itemInWishlist ? 'currentColor' : 'none'} strokeWidth={itemInWishlist ? 2 : 1.5} />
          </button>

          {handleQuickView && (
            <button
              className="p-2 rounded-full bg-white/90 backdrop-blur-md shadow-sm transition-all duration-300 transform scale-0 group-hover:scale-100 focus:scale-100 active:scale-95 text-gray-900 hover:bg-white delay-75"
              onClick={(e) => {
                e.preventDefault();
                handleQuickView(product);
              }}
              aria-label="Quick View"
            >
              <Eye size={14} strokeWidth={1.5} />
            </button>
          )}
        </div>

        {/* Hover Cart Button (Desktop) */}
        <div className="absolute bottom-3 left-3 right-3 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden md:block z-20">
          <button
            className={`w-full text-[10px] font-bold py-3 tracking-[0.2em] transition-colors flex items-center justify-center gap-2 rounded-none backdrop-blur-sm shadow-md ${isProductInCart && isProductInCart(product._id)
              ? 'bg-green-600/95 text-white hover:bg-green-700'
              : 'bg-black/95 text-white hover:bg-black'
              }`}
            onClick={onCartClick}
          >
            <ShoppingBag size={14} />
            {isProductInCart && isProductInCart(product._id) ? "VIEW CART" : "ADD TO CART"}
          </button>
        </div>
      </Link>

      {/* Info Container */}
      <div className="pt-4 pb-2 px-1 flex flex-col flex-grow text-center md:text-left">
        {/* Category String */}
        {categoryName && (
          <span className="text-[#ff1837] text-[9px] font-bold tracking-[0.2em] mb-1.5 line-clamp-1 block mx-auto md:mx-0 w-fit">
            {categoryName}
          </span>
        )}

        {/* Title */}
        <Link to={`/product/${product._id}`} className="block mb-1.5 flex-grow group-hover:text-black transition-colors text-gray-900">
          <h3 className="text-[12px] font-bold tracking-wide leading-tight line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Price Row */}
        <div className="flex items-center justify-center md:justify-start gap-2 mt-auto pt-1">
          <span className="text-[14px] font-extrabold text-black tracking-widest">
            ৳{product.price?.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-[12px] font-semibold text-gray-400 line-through tracking-wider">
              ৳{product.cuttedPrice?.toLocaleString()}
            </span>
          )}
        </div>

        {/* Mobile Cart Button (Only shows on mobile, sits below price) */}
        <button
          className={`w-full mt-3 text-[10px] font-bold py-2.5 tracking-widest md:hidden flex items-center justify-center gap-2 transition-colors border ${isProductInCart && isProductInCart(product._id)
            ? 'bg-green-600 border-green-600 text-white'
            : 'bg-transparent border-black text-black hover:bg-black hover:text-white active:bg-gray-900 active:text-white'
            }`}
          onClick={onCartClick}
        >
          <ShoppingBag size={14} />
          {isProductInCart && isProductInCart(product._id) ? "CART" : "+ CART"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
