import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ProductHighlightsBlock from "../../../ProductDetails/ProductHighlightsBlock";
import ProductReviewsBlock from "../../../ProductDetails/ProductReviewsBlock";
// import StarIcon from "@mui/icons-material/Star";
import { getDiscount } from "../../../../utils/functions";
import OptimizedImg from "../../../common/OptimizedImg";

const QuickViewDialog = ({
  open,
  onClose,
  product,
  isProductInCart,
  addToCartHandler,
  initialSelectedImageUrl,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  // Map initialSelectedImageUrl to index if provided
  React.useEffect(() => {
    if (initialSelectedImageUrl && product?.images?.length) {
      const idx = product.images.findIndex(
        (img) => img.url === initialSelectedImageUrl
      );
      if (idx >= 0) setCurrentSlide(idx);
    }
  }, [initialSelectedImageUrl, product]);
  if (!product) return null;
  const itemInCart = isProductInCart(product._id);
  const goToCart = () => window.location.assign("/cart");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      PaperProps={{
        sx: {
          borderRadius: 0,
          backgroundColor: "var(--primary-bg)",
          boxShadow: "none",
          overflow: "auto",
        },
      }}
      sx={{
        zIndex: 1400,
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(0,0,0,0.12)",
          backdropFilter: "blur(6px)",
        },
      }}
    >
      <div className="relative w-full min-h-screen flex rounded-xl flex-col">
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          size="large"
          sx={{
            position: "absolute",
            top: 24,
            right: 24,
            zIndex: 10,
            color: "var(--primary-blue-light)",
            background: "rgba(255,255,255,0.7)",
            border: "none",
            borderRadius: "12px",
            transition: "transform 0.3s",
            "&:hover": {
              transform: "rotate(90deg)",
              background: "rgba(255,255,255,0.7)",
              color: "var(--primary-blue-light)",
            },
          }}
        >
          <CloseIcon fontSize="large" />
        </IconButton>
        {/* Main Content: match ProductDetails.jsx */}
        <div className="max-w-7xl mx-auto flex flex-col rounded-xl lg:flex-row gap-0 px-0 md:px-0 pt-20 pb-10">
          {/* Left: Responsive Image Gallery */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start">
            {/* Mobile: show only current image */}
            <div className="block w-full aspect-[1/1] max-w-lg mx-auto bg-[var(--primary-bg)] rounded-xl flex items-center justify-center">
              {product?.images?.[currentSlide] && (
                <OptimizedImg
                  src={
                    product.images[currentSlide]?.url ||
                    initialSelectedImageUrl ||
                    product?.images?.[0]?.url ||
                    ""
                  }
                  alt={product?.name || "Product image"}
                  className="w-full h-full object-cover rounded-xl"
                  draggable={false}
                  quality="85"
                  format="auto"
                  placeholder="blur"
                  priority={true}
                />
              )}
            </div>
            {/* Mobile: thumbnails below image */}
            <div className="flex flex-row gap-2 mt-3 w-full justify-center px-2">
              {product?.images?.map((item, i) => (
                <OptimizedImg
                  key={`thumb-mobile-${i}`}
                  src={item?.url || ""}
                  alt={product?.name || "Product thumbnail"}
                  className={`w-14 h-14 object-cover rounded border-2 ${
                    currentSlide === i
                      ? "border-[var(--primary-blue-dark)]"
                      : "border-[var(--primary-blue-light)] opacity-70"
                  } cursor-pointer transition-all duration-200 hover:opacity-90`}
                  onClick={() => setCurrentSlide(i)}
                  style={{ background: "var(--primary-bg)" }}
                  quality="70"
                  format="auto"
                  placeholder="blur"
                />
              ))}
            </div>
            {/* Single thumbnails row only */}
          </div>
          {/* Right: Product Info */}
          <div
            className="w-full lg:w-1/2 flex flex-col justify-start gap-6 px-6 py-8 lg:sticky lg:top-8"
            style={{ height: "fit-content" }}
          >
            {product?.category && (
              <span className="text-xs font-bold uppercase text-[var(--primary-blue-light)] tracking-wide mb-1">
                {product.category}
              </span>
            )}
            <h1 className="text-3xl font-extrabold text-[var(--primary-blue-dark)] mb-2 leading-tight">
              {product?.name}
            </h1>
            {/* Stock Indicator Bar */}
            {/* {typeof product?.stock === "number" && (
              <div className="mb-3 items-center gap-2">
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
                      width: `${Math.min(
                        100,
                        Math.max(10, product.stock * 10)
                      )}%`,
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
            {/* <div className="flex items-center gap-3 mb-2">
              <span className="flex items-center gap-1 text-base font-bold text-[var(--primary-blue-light)]">
                {product?.ratings?.toFixed(1) || 0}
                <StarIcon
                  sx={{ fontSize: 18, color: "var(--primary-blue-light)" }}
                />
              </span>
              <span className="text-sm text-[var(--primary-blue-dark)] font-medium">
                ({product?.numOfReviews || 0} reviews)
              </span>
            </div> */}
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-2xl font-bold text-[var(--primary-blue-dark)]">
                ৳{product?.price?.toLocaleString() || 0}
              </span>
              {product?.cuttedPrice && (
                <span className="text-lg text-[var(--primary-blue-dark)] opacity-60 line-through">
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
            <div className="flex gap-3 my-4">
              {product?.stock > 0 && (
                <button
                  onClick={
                    itemInCart ? goToCart : () => addToCartHandler(product._id)
                  }
                  className="flex-1 py-3 flex items-center justify-center gap-2 rounded-full bg-[var(--button-bg)] text-white font-bold border border-[var(--primary-blue-light)] hover:bg-[var(--primary-blue-dark)] hover:text-white transition-all"
                >
                  {itemInCart ? "GO TO CART" : "ADD TO CART"}
                </button>
              )}
            </div>
            {/* Go to Product Page Button */}
            <div className="flex gap-3 mb-4">
              <button
                onClick={() =>
                  window.location.assign(`/product/${product._id}`)
                }
                className="w-full py-3 flex items-center justify-center gap-2 rounded-full bg-transparent text-[var(--primary-blue-dark)] font-bold border-2 border-[var(--primary-blue-light)] hover:bg-[var(--primary-blue-light)] hover:text-white transition-all"
              >
                GO TO PRODUCT PAGE
              </button>
            </div>
            {/* Description */}
            <div
              className="text-[var(--primary-blue-dark)]"
              dangerouslySetInnerHTML={{ __html: product?.description || "" }}
              style={{
                padding: 0,
                whiteSpace: "normal",
                lineHeight: 1.6,
                fontSize: "1.05rem",
              }}
            />
            <ProductHighlightsBlock product={product} />
            <ProductReviewsBlock product={product} />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default QuickViewDialog;
