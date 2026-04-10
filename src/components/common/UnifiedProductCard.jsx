import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../actions/wishlistAction";
import OptimizedImg from "./OptimizedImg";

// Add custom styles for unified card (inject only once)
const UnifiedProductCard = ({
  product,
  isProductInCart,
  addToCartHandler,
  goToCartHandler,
  handleQuickView,
}) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { wishlistItems } = useSelector((state) => state.wishlist || { wishlistItems: [] });
  const itemInWishlist = wishlistItems.some((i) => i.product === product._id);

  // Track image hover and selected color image
  const [isHovered, setIsHovered] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);

  // Determine which image to show
  const mainImage = selectedImageUrl || product.images?.[0]?.url || "/no-pictures.png";
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

  const inCart = typeof isProductInCart === 'function' ? isProductInCart(product._id) : false;

  return (
    <div className="bg-white border-none shadow-[0_4px_12px_rgba(0,0,0,0.06)] p-3 transition-all duration-200 relative flex flex-col h-full rounded-xl min-h-[350px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 group/card md:p-4 lg:p-[18px] md:h-[400px] lg:h-[390px]">
      {/* Image Section */}
      <div
        className="relative w-full h-[200px] flex items-center justify-center bg-[#f8fafc] p-2 rounded-xl overflow-hidden m-2 mx-auto md:h-[220px] lg:max-h-[230px] md:rounded-[14px] lg:rounded-2xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={`/product/${product._id}`} className="block w-full h-full">
          <OptimizedImg
            src={isHovered && hoverImage && !selectedImageUrl ? hoverImage : mainImage}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-300 md:scale-[0.9] group-hover/card:scale-[1.02]"
            quality="80"
            format="auto"
            placeholder="blur"
          />
        </Link>

        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-[#FF1837] text-white px-2 py-1 rounded-xl text-[0.8rem] font-semibold z-[3]">
            -{product.discount}%
          </div>
        )}

        {/* Polarized Indicator */}
        {product.categories && product.categories.some(cat =>
          (typeof cat === 'string' ? cat : cat.name) === 'Polarized'
        ) && (
            <div className="absolute top-2 right-2 bg-white/90 p-1 rounded-lg z-[3] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
              <img
                src="/polarized.JPG"
                alt="Polarized"
                className="w-8 h-8 object-contain"
              />
            </div>
          )}

        {/* Actions - appear on top right */}
        <div className="absolute top-3 right-3 flex flex-col gap-[10px] z-[2] items-end">
          <button
            className="bg-transparent border-none p-0 cursor-pointer flex items-center justify-center transition-all duration-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.08)] relative group/btn"
            aria-label={itemInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            onClick={handleWishlistClick}
            type="button"
          >
            <span className="absolute right-full top-1/2 z-10 mr-2 -translate-y-1/2 whitespace-nowrap rounded bg-[#0f172a] px-3 py-1 text-xs text-white shadow-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 pointer-events-none">
              {itemInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            </span>
            <svg
              className={`w-6 h-6 transition-colors duration-200 ${itemInWishlist
                  ? "text-red-500 fill-current"
                  : "text-gray-400 hover:text-red-500"
                }`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>

          <button
            className="bg-transparent border-none p-0 cursor-pointer flex items-center justify-center transition-all duration-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.08)] relative group/btn"
            aria-label={inCart ? "Go to cart" : "Add to cart"}
            onClick={() => (inCart ? goToCartHandler() : addToCartHandler(product._id))}
            type="button"
          >
            <span className="absolute right-full top-1/2 z-10 mr-2 -translate-y-1/2 whitespace-nowrap rounded bg-[#0f172a] px-3 py-1 text-xs text-white shadow-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 pointer-events-none">
              {inCart ? "Go to Cart" : "Add to Cart"}
            </span>
            <svg
              className={`w-6 h-6 transition-colors duration-200 ${inCart ? "text-green-600" : "text-gray-400 hover:text-[#0f172a]"
                }`}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.16 14h9.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0011.9 6H6.21l-.94-2H2v2h2l3.6 7.59-1.35 2.44C5.52 16.37 6.48 18 8 18h12v-2H8l1.16-2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Details Section */}
      <div className="pt-[10px] flex flex-col items-start gap-0.5 flex-1 justify-between">
        <div className="w-full">
          <Link
            to={`/product/${product._id}`}
            state={selectedImageUrl ? { selectedImageUrl } : undefined}
            className="block"
          >
            <h3 className="text-[1.05rem] font-bold mb-0.5 text-[#0f172a] text-left leading-[1.2] min-h-[2.6em] line-clamp-2 md:text-[1.1rem] lg:text-[1.15rem]">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center justify-between gap-1.5 mb-0.5">
            <div className="flex items-center gap-1">
              <span className="text-[1rem] font-medium text-[#0f172a] md:text-[1.2rem] lg:text-[1.25rem] md:font-bold">
                ৳{product.price}
              </span>
              {product.cuttedPrice > product.price && (
                <span className="text-[0.95rem] text-[#aaa] line-through ml-0.5 hidden sm:inline md:text-[0.9rem]">
                  ৳{product.cuttedPrice}
                </span>
              )}
              {product.discount > 0 && (
                <span className="text-[0.92rem] text-[#4f46e5] font-medium ml-0.5 hidden sm:inline">
                  (-{product.discount}%)
                </span>
              )}
            </div>

            {/* Color Variations */}
            {product.isDifferentColors && product.images?.length > 1 && (
              <div className="flex-shrink-0 ml-0.5">
                <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-[#4f46e5] scrollbar-track-transparent max-w-[120px]">
                  {product.images.map((img, idx) => (
                    <div key={idx} className="relative group/color flex-shrink-0">
                      <button
                        onClick={(e) => { e.preventDefault(); setSelectedImageUrl(img.url); }}
                        className={`relative w-12 h-12 rounded-full overflow-hidden transition-all duration-200 sm:w-14 sm:h-14 ${selectedImageUrl === img.url
                            ? 'ring-2 ring-[#fde047] shadow-md'
                            : 'ring-1 ring-gray-200 hover:ring-[#4f46e5]'
                          }`}
                        aria-label={`Color ${idx + 1}`}
                      >
                        <img src={img.url} alt={`Color ${idx + 1}`} className="w-full h-full object-cover rounded-full" />
                      </button>
                      {selectedImageUrl === img.url && (
                        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#fde047] rounded-full border border-white shadow-sm"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2 mt-auto">
          <Link
            to={`/product/${product._id}`}
            state={selectedImageUrl ? { selectedImageUrl } : undefined}
            className="w-full mt-[10px] text-[1rem] font-semibold border-2 border-[#f3e955] bg-[#f3e955] text-[#0f172a] py-2 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center no-underline hover:bg-[#FF1837] hover:border-[#FF1837] hover:text-white hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(255,24,55,0.25)] md:py-3 lg:py-4 md:rounded-2xl lg:rounded-2xl md:text-[1.1rem]"
          >
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnifiedProductCard;
