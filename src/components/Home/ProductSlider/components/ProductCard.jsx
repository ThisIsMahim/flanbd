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

// Anime Jet Tag Specialized Product Card Styles
if (typeof document !== "undefined") {
  const existing = document.getElementById("anime-jet-product-card-style");
  const style = existing || document.createElement("style");
  style.id = "anime-jet-product-card-style";
  style.innerHTML = `
    .anime-jet-product-card {
      background: #ffffff;
      border: none;
      box-shadow: none;
      padding: 20px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 420px;
      border-radius: 20px;
      overflow: hidden;
    }
    .anime-jet-product-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #ef4444 0%, #dc2626 50%, #ef4444 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .anime-jet-product-card:hover {
      box-shadow: none;
      transform: translateY(-4px);
    }
    .anime-jet-product-card:hover::before {
      opacity: 1;
    }
    
    .anime-jet-image-container {
      position: relative;
      width: 100%;
      height: 220px;
      flex: 0 0 220px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
      overflow: hidden;
      padding: 12px;
      border-radius: 16px;
      margin: 0;
      border: none;
    }
    .anime-jet-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 12px;
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), filter 0.3s ease;
    }
    .anime-jet-image-container:hover .anime-jet-image {
      transform: scale(1.08) rotate(1deg);
      filter: brightness(1.1) contrast(1.05);
    }
    
    .anime-jet-product-icons {
      position: absolute;
      top: 16px;
      right: 16px;
      display: flex;
      gap: 10px;
      z-index: 2;
    }
    .anime-jet-icon-btn {
      width: 44px;
      height: 44px;
      background: rgba(255, 255, 255, 0.9) !important;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: none;
      border-radius: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: none;
    }
    .anime-jet-icon-btn:hover {
      background: #ef4444 !important;
      transform: translateY(-2px) scale(1.05);
      box-shadow: none;
    }
    .anime-jet-icon-btn svg {
      width: 20px;
      height: 20px;
      transition: all 0.3s ease;
    }
    .anime-jet-icon-btn:hover svg {
      transform: scale(1.1);
    }
    
    .anime-jet-product-info {
      padding: 16px 0 0 0;
      display: flex;
      flex-direction: column;
      flex: 1;
      justify-content: space-between;
    }
    
    .anime-jet-product-title {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 12px;
      color: #1f2937;
      line-height: 1.4;
      min-height: 2.8em;
      overflow: hidden;
      word-break: break-word;
      text-align: center;
    }
    
    .anime-jet-product-price-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }
    .anime-jet-product-price {
      font-size: 1.3rem;
      font-weight: 800;
      color: #1f2937;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
    .anime-jet-product-cutted {
      font-size: 1rem;
      color: #6b7280;
      text-decoration: line-through;
      opacity: 0.7;
    }
    .anime-jet-product-discount {
      font-size: 0.9rem;
      color: #ffffff;
      font-weight: 700;
      background: #ef4444;
      padding: 4px 8px;
      border-radius: 8px;
      border: 1px solid #dc2626;
    }
    
    .anime-jet-quick-view-icon-btn {
      width: 52px;
      height: 52px;
      border: none;
      background: #ffffff;
      color: #6b7280;
      border-radius: 16px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: none;
    }
    .anime-jet-quick-view-icon-btn:hover {
      background: #ef4444 !important;
      color: #ffffff !important;
      transform: translateY(-2px) scale(1.05);
      box-shadow: none;
    }
    
    .anime-jet-buy-now-btn {
      flex: 1;
      font-size: 1.1rem;
      font-weight: 700;
      border: none;
      background: #ef4444;
      color: #ffffff;
      padding: 14px 0;
      border-radius: 16px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: none;
    }
    .anime-jet-buy-now-btn:hover {
      background: #dc2626 !important;
      color: #ffffff !important;
      transform: translateY(-2px) scale(1.02);
      box-shadow: none;
    }
    
    .anime-jet-polarized-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      padding: 6px;
      border-radius: 12px;
      z-index: 3;
      box-shadow: none;
      border: none;
    }
    .anime-jet-discount-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      background: #ef4444;
      color: #ffffff;
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 0.8rem;
      font-weight: 800;
      z-index: 3;
      box-shadow: none;
      border: none;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .anime-jet-subcategory-badge {
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
      color: #6b7280;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      margin-bottom: 8px;
      display: inline-block;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: none;
      border: none;
    }
    
    /* COMMENTED OUT: Color variations scroll - as requested */
    /*
    .color-variations-scroll {
      scrollbar-width: thin;
      scrollbar-color: var(--primary-blue-light) transparent;
    }
    .color-variations-scroll::-webkit-scrollbar {
      height: 4px;
    }
    .color-variations-scroll::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 2px;
    }
    .color-variations-scroll::-webkit-scrollbar-thumb {
      background: var(--primary-blue-light);
      border-radius: 2px;
    }
    .color-variations-scroll::-webkit-scrollbar-thumb:hover {
      background: var(--primary-blue-dark);
    }
    */
    
    /* Mobile styles */
    @media (max-width: 768px) {
      .anime-jet-product-card {
        padding: 16px;
        min-height: 400px;
        border-radius: 16px;
        margin-bottom: 16px;
      }
      .anime-jet-image-container {
        height: 200px;
        flex: 0 0 200px;
        padding: 8px;
        border-radius: 12px;
      }
      .anime-jet-image {
        object-fit: cover;
        border-radius: 8px;
      }
      .anime-jet-product-icons {
        top: 12px;
        right: 12px;
        gap: 8px;
      }
      .anime-jet-icon-btn {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .anime-jet-icon-btn svg {
        width: 18px;
        height: 18px;
      }
      .anime-jet-product-title {
        font-size: 1rem;
        text-align: center;
        margin-bottom: 10px;
      }
      .anime-jet-product-price {
        font-size: 1.2rem;
        text-align: center;
      }
      .anime-jet-quick-view-icon-btn {
        width: 48px;
        height: 48px;
        border-radius: 14px;
      }
      .anime-jet-buy-now-btn {
        padding: 12px 0;
        font-size: 1rem;
        border-radius: 14px;
      }
      .anime-jet-product-price-row {
        display: none !important;
      }
      .lg\\:hidden {
        display: block !important;
      }
    }
    
    /* Desktop styles */
    @media (min-width: 769px) {
      .anime-jet-product-card {
        min-height: 450px;
        padding: 24px;
        border-radius: 24px;
        box-shadow: none;
      }
      .anime-jet-product-card:hover {
        transform: translateY(-6px);
        box-shadow: none;
      }
      .anime-jet-image-container {
        height: 240px;
        flex: 0 0 240px;
        padding: 16px;
        border-radius: 20px;
      }
      .anime-jet-image {
        object-fit: contain;
        border-radius: 12px;
      }
      .anime-jet-product-title {
        font-size: 1.2rem;
        margin-bottom: 14px;
      }
      .anime-jet-product-price {
        font-size: 1.4rem;
      }
      .anime-jet-quick-view-icon-btn {
        width: 56px;
        height: 56px;
        border-radius: 18px;
      }
      .anime-jet-buy-now-btn {
        padding: 16px 0;
        font-size: 1.15rem;
        border-radius: 18px;
      }
      .anime-jet-product-price-row {
        display: flex !important;
      }
    }
  `;
  if (!existing) {
    document.head.appendChild(style);
  }
}

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
  // Track image hover
  const [isHovered, setIsHovered] = useState(false);
  // const [selectedImageUrl, setSelectedImageUrl] = useState(null); // Commented out - color variations disabled

  // Determine which image to show
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

  return (
    <div className="anime-jet-product-card">
      {/* Image Section */}
      <div
        className="anime-jet-image-container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={`/product/${product._id}`} className="block w-full h-full">
          <OptimizedImg
            src={isHovered && hoverImage ? hoverImage : mainImage}
            alt={product.name}
            className="anime-jet-image"
            objectFit="contain"
            quality="80"
            format="auto"
            placeholder="blur"
          />
        </Link>

        {/* Discount Badge */}
        {product.cuttedPrice && product.price < product.cuttedPrice && (
          <div className="anime-jet-discount-badge">
            -{getDiscount(product.price, product.cuttedPrice)}%
          </div>
        )}

        {/* Polarized Indicator */}
        {product.categories &&
          product.categories.some(
            (cat) => (typeof cat === "string" ? cat : cat.name) === "Polarized"
          ) && (
            <div className="anime-jet-polarized-badge">
              <img
                src="/polarized.JPG"
                alt="Polarized"
                className="w-8 h-8 object-contain"
              />
            </div>
          )}

        <div className="anime-jet-product-icons">
          {/* Wishlist button */}
          <button
            className="anime-jet-icon-btn group"
            aria-label={
              itemInWishlist ? "Remove from wishlist" : "Add to wishlist"
            }
            onClick={handleWishlistClick}
            type="button"
          >
            <span className="absolute right-full top-1/2 z-10 mr-2 -translate-y-1/2 whitespace-nowrap rounded bg-gray-800 px-3 py-1 text-xs text-white shadow-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 group-hover:pointer-events-auto group-focus:pointer-events-auto transition-opacity duration-200 pointer-events-none">
              {itemInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill={itemInWishlist ? "#ef4444" : "none"}
              viewBox="0 0 24 24"
              stroke="#1f2937"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
          {/* Cart button */}
          <button
            className="anime-jet-icon-btn group"
            aria-label={
              isProductInCart(product._id) ? "Go to cart" : "Add to cart"
            }
            onClick={() =>
              isProductInCart(product._id)
                ? goToCartHandler()
                : addToCartHandler(product._id)
            }
            type="button"
          >
            <span className="absolute right-full top-1/2 z-10 mr-2 -translate-y-1/2 whitespace-nowrap rounded bg-gray-800 px-3 py-1 text-xs text-white shadow-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 group-hover:pointer-events-auto group-focus:pointer-events-auto transition-opacity duration-200 pointer-events-none">
              {isProductInCart(product._id) ? "Go to Cart" : "Add to Cart"}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill={isProductInCart(product._id) ? "#ef4444" : "transparent"}
              viewBox="0 0 24 24"
              stroke="#1f2937"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </button>
        </div>
      </div>
      {/* Details Section */}
      <div className="anime-jet-product-info">
        <div className="w-full">
          {/* Subcategory Badge */}
          {subcategory && (
            <div className="anime-jet-subcategory-badge">
              {subcategory.name}
            </div>
          )}

          <Link to={`/product/${product._id}`} className="block">
            <div className="anime-jet-product-title">{product.name}</div>
          </Link>
          {/* Desktop Layout - Side by side (hidden on mobile, flex on desktop) */}
          <div className="anime-jet-product-price-row hidden lg:flex">
            <div className="flex items-center gap-1">
              <span className="anime-jet-product-price">
                ৳{product.price?.toLocaleString() || 0}
              </span>
              {product.cuttedPrice && product.price < product.cuttedPrice && (
                <>
                  <span className="anime-jet-product-cutted">
                    ৳{product.cuttedPrice.toLocaleString()}
                  </span>
                  <span className="anime-jet-product-discount">
                    -{getDiscount(product.price, product.cuttedPrice)}%
                  </span>
                </>
              )}
            </div>

            {/* COMMENTED OUT: Color Variations - as requested */}
            {/*
            {product.isDifferentColors && product.images?.length > 1 && (
              <div className="flex-shrink-0 ml-0.5">
                <div
                  className="flex items-center gap-1 overflow-x-auto color-variations-scroll pb-1"
                  style={{
                    scrollbarWidth: "thin",
                    msOverflowStyle: "scrollbar",
                    maxWidth: "120px",
                  }}
                >
                  {product.images.map((img, idx) => (
                    <div key={idx} className="relative group flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedImageUrl(img.url);
                        }}
                        className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden transition-all duration-200 ${
                          selectedImageUrl === img.url
                            ? "ring-2 ring-[var(--brand-yellow)] shadow-md"
                            : "ring-1 ring-gray-200 hover:ring-[var(--primary-blue-light)]"
                        }`}
                        aria-label={`Color ${idx + 1}`}
                      >
                        <img
                          src={img.url}
                          alt={`Color ${idx + 1}`}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            */}
          </div>

          {/* Mobile Layout - Conditional pricing */}
          <div className="lg:hidden">
            {product.cuttedPrice && product.price < product.cuttedPrice ? (
              /* When has discount - show price and cutted price in same row, % OFF in separate row */
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2 justify-center">
                  <span className="anime-jet-product-price text-lg font-bold">
                    ৳{product.price?.toLocaleString() || 0}
                  </span>
                  <span className="text-sm text-gray-600 line-through">
                    ৳{product.cuttedPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-center">
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                    {getDiscount(product.price, product.cuttedPrice)}% OFF
                  </span>
                </div>
              </div>
            ) : (
              /* Default case - only current price */
              <div className="flex flex-col items-center gap-1">
                <span className="anime-jet-product-price text-lg font-bold">
                  ৳{product.price?.toLocaleString() || 0}
                </span>
              </div>
            )}

            {/* COMMENTED OUT: Mobile Color Variations - as requested */}
            {/*
            {product.isDifferentColors && product.images?.length > 1 && (
              <div className="mt-3 flex justify-center">
                <div
                  className="flex items-center gap-2 overflow-x-auto color-variations-scroll pb-1"
                  style={{
                    scrollbarWidth: "thin",
                    msOverflowStyle: "scrollbar",
                    maxWidth: "200px",
                  }}
                >
                  {product.images.map((img, idx) => (
                    <div key={idx} className="relative group flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedImageUrl(img.url);
                        }}
                        className={`relative w-8 h-8 rounded-full overflow-hidden transition-all duration-200 ${
                          selectedImageUrl === img.url
                            ? "ring-2 ring-[var(--brand-yellow)] shadow-md"
                            : "ring-1 ring-gray-200 hover:ring-[var(--brand-yellow)]"
                        }`}
                        aria-label={`Color ${idx + 1}`}
                      >
                        <img
                          src={img.url}
                          alt={`Color ${idx + 1}`}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            */}
          </div>
        </div>
        <div className="flex w-full gap-3 mt-auto">
          <button
            onClick={() => handleQuickView(product)}
            className="anime-jet-quick-view-icon-btn"
            aria-label="Quick View"
            title="Quick View"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
          <Link
            to={`/product/${product._id}`}
            className="anime-jet-buy-now-btn flex-1"
          >
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
