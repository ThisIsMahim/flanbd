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
if (typeof document !== "undefined") {
  const existing = document.getElementById("unified-product-card-style");
  const style = existing || document.createElement("style");
  style.id = "unified-product-card-style";
  style.innerHTML = `
    .unified-product-card {
      background: rgb(255, 255, 255);
      border: none;
      box-shadow: 0 4px 12px rgba(0,0,0,0.06);
      padding: 12px;
      transition: box-shadow 0.2s;
      position: relative;
      display: flex;
      flex-direction: column;
      height: 100%;
      border-radius: 12px;
      min-height: 350px;
    }
    .unified-product-card:hover {
      box-shadow: 0 8px 20px rgba(0,0,0,0.08);
      transform: translateY(-2px);
    }
    .unified-product-image-container {
      position: relative;
      width: 100%;
      height: 200px;
      flex: 0 0 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8fafc;
      padding: 8px;
      border-radius: 12px;
      overflow: hidden;
      margin: 8px;
    }
    .unified-product-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
      max-width: 85%;
      max-height: 95%;
      background: var(--primary-bg);
      border-radius: 0;
      box-shadow: none;
      transition: transform 0.3s;
      display: block;
    }
    .unified-product-image-container:hover .unified-product-image {
      transform: scale(1.02);
    }
    .unified-product-icons {
      position: absolute;
      top: 12px;
      right: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      z-index: 2;
      align-items: flex-end;
    }
    .unified-icon-btn {
      background: transparent !important;
      border: none;
      padding: 0;
      margin: 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: filter 0.2s;
      filter: drop-shadow(0 1px 2px rgba(0,0,0,0.08));
      position: relative;
    }
    .unified-icon-btn:hover {
      background: transparent !important;
    }
    .unified-product-info {
      padding: 10px 0 0 0;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
      flex: 1;
      justify-content: space-between;
    }
    .unified-product-title {
      font-size: 1.05rem;
      font-weight: 700;
      margin-bottom: 1px;
      color: var(--primary-blue-dark);
      text-align: left;
      line-height: 1.2;
      min-height: 2.6em;
      overflow: hidden;
      word-break: break-word;
    }
    .unified-product-price-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      margin-bottom: 1px;
    }
    .unified-product-price {
      font-size: 1rem;
      font-weight: 500;
      color: var(--primary-blue-dark);
    }
    .unified-product-cutted {
      font-size: 0.95rem;
      color: #aaa;
      text-decoration: line-through;
      margin-left: 2px;
    }
    .unified-product-discount {
      font-size: 0.92rem;
      color: var(--primary-blue-light);
      font-weight: 500;
      margin-left: 2px;
    }
    .unified-quick-view-btn {
      width: 100%;
      margin-top: 10px;
      font-size: 1rem;
      font-weight: 400;
      border: 2px solid var(--primary-blue-light);
      background: var(--primary-bg);
      color: var(--primary-blue-dark);
      padding: 8px 0;
      border-radius: 12px;
      transition: background 0.2s, color 0.2s;
      cursor: pointer;
      outline: none;
    }
    .unified-quick-view-btn:hover {
      background: var(--primary-blue-light) !important;
      color: var(--primary-bg) !important;
    }
    .unified-buy-now-btn {
      width: 100%;
      margin-top: 10px;
      font-size: 1rem;
      font-weight: 600;
      border: 2px solid rgb(243,233,85);
      background: rgb(243,233,85);
      color: #0f172a;
      padding: 8px 0;
      border-radius: 12px;
      transition: all 0.2s;
      cursor: pointer;
      outline: none;
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .unified-buy-now-btn:hover {
      background: rgb(220, 200, 60) !important;
      border-color: rgb(220, 200, 60) !important;
      color: #0f172a !important;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    /* Color variations scrollbar styling */
    .unified-color-scroll {
      scrollbar-width: thin;
      scrollbar-color: var(--primary-blue-light) transparent;
    }
    .unified-color-scroll::-webkit-scrollbar {
      height: 4px;
    }
    .unified-color-scroll::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 2px;
    }
    .unified-color-scroll::-webkit-scrollbar-thumb {
      background: var(--primary-blue-light);
      border-radius: 2px;
    }
    .unified-color-scroll::-webkit-scrollbar-thumb:hover {
      background: var(--primary-blue-dark);
    }
    
    /* Mobile responsive styles */
    @media (max-width: 768px) {
      .unified-product-card {
        min-height: 360px;
        height: 360px;
        padding: 8px;
        border-radius: 12px;
      }
      .unified-product-image-container {
        height: 180px;
        flex: 0 0 180px;
        padding: 0;
        margin: 0;
        margin-bottom: 8px;
        border-radius: 8px;
        overflow: hidden;
      }
      .unified-product-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 0;
        margin: 0;
        padding: 0;
      }
      .unified-product-title {
        font-size: 0.9rem;
        line-height: 1.3;
        margin-bottom: 4px;
      }
      .unified-product-price {
        font-size: 1rem;
        font-weight: 700;
      }
      /* Hide TK text and discounted price on mobile */
      .unified-product-cutted {
        display: none;
      }
      .unified-product-discount {
        display: none;
      }
      .unified-buy-now-btn {
        padding: 10px 0;
        font-size: 0.9rem;
        font-weight: 600;
        border-radius: 8px;
        margin-top: auto;
        width: 100%;
        text-align: center;
      }
      /* Color variations mobile positioning */
      .unified-color-scroll {
        max-width: 60px !important;
        margin-left: 0px;
      }
      .unified-color-scroll button {
        width: 16px !important;
        height: 16px !important;
        border-radius: 50% !important;
      }
    }
    
    /* Desktop responsive styles */
    @media (min-width: 769px) {
      .unified-product-card {
        min-height: 380px;
        height: 400px!important;
        padding: 16px;
        border-radius: 16px;
      }
      .unified-product-image-container {
        height: 200px;
        flex: 0 0 200px;
        // padding: 10px 6px;
        // margin: 10px;
        border-radius: 14px;
      }
      .unified-product-title {
        font-size: 1.1rem;
        font-weight: 700;
        margin-bottom: 6px;
      }
      .unified-product-price {
        font-size: 1.2rem;
        font-weight: 700;
      }
      .unified-buy-now-btn {
        padding: 12px 0;
        font-size: 1rem;
        font-weight: 600;
        border-radius: 12px;
        margin-top: 10px;
      }
    }
    
    /* Large desktop responsive styles */
    @media (min-width: 1200px) {
      .unified-product-card {
        min-height: 390px;
        height: 390px!important;
        padding: 18px;
        border-radius: 18px;
      }
      .unified-product-image-container {
        max-height: 230px;
        // padding: 12px 8px;
        // margin: 12px;
        border-radius: 16px;
      }
      .unified-product-title {
        font-size: 1.15rem;
      }
      .unified-product-price {
        font-size: 1.25rem;
      }
    }
    .unified-discount-badge {
      position: absolute;
      top: 8px;
      left: 8px;
      background: var(--primary-blue-light);
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
      z-index: 3;
    }
    .unified-polarized-badge {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(255, 255, 255, 0.9);
      padding: 4px;
      border-radius: 8px;
      z-index: 3;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    /* Mobile-specific styles for better design and touch experience */
    @media (max-width: 768px) {
      .unified-product-card {
        padding: 12px;
        min-height: 320px;
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        margin-bottom: 16px;
      }
      .unified-product-image-container {
        height: clamp(220px, 35vw, 260px);
        padding: 8px;
        border-radius: 12px;
        margin-bottom: 12px;
      }
      .unified-product-image {
        max-width: 95%;
        max-height: 95%;
        object-fit: contain;
      }
      .unified-product-icons {
        top: 12px;
        right: 12px;
        gap: 8px;
      }
      .unified-icon-btn {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.95) !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        backdrop-filter: blur(8px);
      }
      .unified-icon-btn svg {
        width: 20px;
        height: 20px;
      }
      .unified-product-title {
        font-size: 1rem;
        line-height: 1.4;
        margin-bottom: 8px;
        font-weight: 600;
        color: #1f2937;
      }
      .unified-product-price {
        font-size: 1.1rem;
        font-weight: 700;
        color: #059669;
      }
      .unified-product-cutted {
        font-size: 0.9rem;
        color: #6b7280;
      }
      .unified-quick-view-btn {
        padding: 14px 0;
        font-size: 1rem;
        font-weight: 600;
        border-radius: 12px;
        margin-top: 12px;
        background: var(--primary-bg);
        color: var(--primary-blue-dark);
        border: 2px solid var(--primary-blue-light);
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      .unified-quick-view-btn:hover {
        background: var(--primary-blue-light) !important;
        color: var(--primary-bg) !important;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
      .unified-buy-now-btn {
        padding: 14px 0;
        font-size: 1rem;
        font-weight: 700;
        border-radius: 12px;
        margin-top: 12px;
        background: rgb(243,233,85);
        color: #0f172a;
        border: 2px solid rgb(243,233,85);
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      .unified-buy-now-btn:hover {
        background: rgb(220, 200, 60) !important;
        border-color: rgb(220, 200, 60) !important;
        color: #0f172a !important;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
    }
    
    /* Desktop two-column enhancement */
    @media (min-width: 769px) {
      .unified-product-card {
        min-height: 400px;
        padding: 20px;
        border-radius: 20px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
      }
      .unified-product-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 16px 48px rgba(0,0,0,0.15);
      }
      .unified-product-image-container {
        height: clamp(240px, 30vw, 280px);
        padding: 16px 12px;
        border-radius: 16px;
      }
      .unified-product-image {
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
      }
      .unified-product-title {
        font-size: 1.2rem;
        font-weight: 700;
        margin-bottom: 12px;
      }
      .unified-product-price {
        font-size: 1.3rem;
        font-weight: 700;
      }
      .unified-quick-view-btn {
        padding: 16px 0;
        font-size: 1.1rem;
        font-weight: 600;
        border-radius: 16px;
        margin-top: 16px;
      }
      .unified-buy-now-btn {
        padding: 16px 0;
        font-size: 1.1rem;
        font-weight: 700;
        border-radius: 16px;
        margin-top: 16px;
        background: rgb(243,233,85);
        color: #0f172a;
        border: 2px solid rgb(243,233,85);
      }
      .unified-buy-now-btn:hover {
        background: rgb(220, 200, 60) !important;
        border-color: rgb(220, 200, 60) !important;
        color: #0f172a !important;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.15);
      }
    }
  `;
  if (!existing) {
    document.head.appendChild(style);
  }
}

const UnifiedProductCard = ({
  product,
  isProductInCart,
  addToCartHandler,
  goToCartHandler,
  handleQuickView,
}) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { wishlistItems } = useSelector((state) => state.wishlist);
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
    <div className="unified-product-card">
      {/* Image Section */}
      <div
        className="unified-product-image-container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={`/product/${product._id}`} className="block w-full h-full">
          <OptimizedImg
            src={isHovered && hoverImage && !selectedImageUrl ? hoverImage : mainImage}
            alt={product.name}
            className="unified-product-image"
            quality="80"
            format="auto"
            placeholder="blur"
          />
        </Link>
        
        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="unified-discount-badge">
            -{product.discount}%
          </div>
        )}
        
        {/* Polarized Indicator */}
        {product.categories && product.categories.some(cat => 
          (typeof cat === 'string' ? cat : cat.name) === 'Polarized'
        ) && (
          <div className="unified-polarized-badge">
            <img 
              src="/polarized.JPG" 
              alt="Polarized" 
              className="w-8 h-8 object-contain"
            />
          </div>
        )}
        
        <div className="unified-product-icons">
          
          <button
            className="unified-icon-btn group"
            aria-label={
              itemInWishlist ? "Remove from wishlist" : "Add to wishlist"
            }
            onClick={handleWishlistClick}
            type="button"
          >
            <span className="absolute right-full top-1/2 z-10 mr-2 -translate-y-1/2 whitespace-nowrap rounded bg-[var(--primary-blue-dark)] px-3 py-1 text-xs text-[var(--primary-bg)] shadow-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 group-hover:pointer-events-auto group-focus:pointer-events-auto transition-opacity duration-200 pointer-events-none">
              {itemInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            </span>
            <svg
              className={`w-6 h-6 transition-colors duration-200 ${
                itemInWishlist
                  ? "text-red-500 fill-current"
                  : "text-gray-400 hover:text-red-500"
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>

          {/* Cart icon (right corner) */}
          <button
            className="unified-icon-btn group"
            aria-label={inCart ? "Go to cart" : "Add to cart"}
            onClick={() => (inCart ? goToCartHandler() : addToCartHandler(product._id))}
            type="button"
          >
            <span className="absolute right-full top-1/2 z-10 mr-2 -translate-y-1/2 whitespace-nowrap rounded bg-[var(--primary-blue-dark)] px-3 py-1 text-xs text-[var(--primary-bg)] shadow-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 group-hover:pointer-events-auto group-focus:pointer-events-auto transition-opacity duration-200 pointer-events-none">
              {inCart ? "Go to Cart" : "Add to Cart"}
            </span>
            <svg
              className={`w-6 h-6 transition-colors duration-200 ${
                inCart ? "text-green-600" : "text-gray-400 hover:text-[var(--primary-blue-dark)]"
              }`}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.16 14h9.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0011.9 6H6.21l-.94-2H2v2h2l3.6 7.59-1.35 2.44C5.52 16.37 6.48 18 8 18h12v-2H8l1.16-2z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Details Section */}
      <div className="unified-product-info">
        <div className="w-full">
        <Link
          to={`/product/${product._id}`}
          state={selectedImageUrl ? { selectedImageUrl } : undefined}
          className="block"
        >
          <h3 className="unified-product-title">
            {product.name}
          </h3>
        </Link>
        
                  <div className="unified-product-price-row">
            <div className="flex items-center gap-1">
              <span className="unified-product-price">
                ৳{product.price}
              </span>
              {product.cuttedPrice > product.price && (
                <span className="unified-product-cutted hidden sm:inline">
                  ৳{product.cuttedPrice}
                </span>
              )}
              {product.discount > 0 && (
                <span className="unified-product-discount hidden sm:inline">
                  (-{product.discount}%)
                </span>
              )}
            </div>
            
            {/* Compact Color Variations - Beside price/discount */}
            {product.isDifferentColors && product.images?.length > 1 && (
              <div className="flex-shrink-0 ml-0.5">
                <div className="flex items-center gap-1 overflow-x-auto unified-color-scroll pb-1" style={{scrollbarWidth: 'thin', msOverflowStyle: 'scrollbar', maxWidth: '120px'}}>
                  {product.images.map((img, idx) => (
                    <div key={idx} className="relative group flex-shrink-0">
                      <button
                        onClick={(e)=>{ e.preventDefault(); setSelectedImageUrl(img.url); }}
                        className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden transition-all duration-200 ${
                          selectedImageUrl===img.url 
                            ? 'ring-2 ring-[var(--brand-yellow)] shadow-md' 
                            : 'ring-1 ring-gray-200 hover:ring-[var(--primary-blue-light)]'
                        }`}
                        aria-label={`Color ${idx+1}`}
                      >
                        <img src={img.url} alt={`Color ${idx+1}`} className="w-full h-full object-cover rounded-full" />
                      </button>
                      {/* Tiny indicator for selected state */}
                      {selectedImageUrl===img.url && (
                        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[var(--brand-yellow)] rounded-full border border-white shadow-sm"></div>
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
            className="unified-buy-now-btn"
          >
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnifiedProductCard;
