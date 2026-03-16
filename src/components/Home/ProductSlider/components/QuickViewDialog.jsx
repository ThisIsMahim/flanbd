import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getDiscount } from "../../../../utils/functions";
import "./QuickView.css";

const QuickViewDialog = ({
  open,
  onClose,
  product,
  isProductInCart,
  addToCartHandler,
  initialSelectedImageUrl,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (initialSelectedImageUrl && product?.images?.length) {
      const idx = product.images.findIndex((img) => img.url === initialSelectedImageUrl);
      if (idx >= 0) setCurrentSlide(idx);
    } else {
      setCurrentSlide(0);
    }
  }, [initialSelectedImageUrl, product, open]);

  if (!product) return null;

  const itemInCart = isProductInCart(product._id);
  const goToCart = () => window.location.assign("/cart");
  const goToProduct = () => window.location.assign(`/product/${product._id}`);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      PaperProps={{
        sx: {
          borderRadius: 0,
          backgroundColor: "#fff",
          boxShadow: "none",
        }
      }}
      sx={{
        zIndex: 1400,
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(8px)",
        },
      }}
    >
      <div className="qv-dialog-container">
        <button className="qv-close-btn" onClick={onClose}>
          <CloseIcon />
        </button>

        {/* Left: Gallery */}
        <section className="qv-gallery">
          <div className="qv-main-image">
            <img
              src={product.images?.[currentSlide]?.url || initialSelectedImageUrl || product.images?.[0]?.url}
              alt={product.name}
            />
          </div>

          <div className="qv-thumbnails">
            {product.images?.map((img, i) => (
              <div
                key={i}
                className={`qv-thumb ${currentSlide === i ? 'active' : ''}`}
                onClick={() => setCurrentSlide(i)}
              >
                <img src={img.url} alt={`Thumbnail ${i}`} />
              </div>
            ))}
          </div>
        </section>

        {/* Right: Info */}
        <aside className="qv-info">
          <span className="qv-brand">{product.brand?.name || "Flan"}</span>
          <h1 className="qv-title">{product.name}</h1>

          <div className="qv-price-row">
            <span className="qv-price-current">৳{product.price?.toLocaleString()}</span>
            {product.cuttedPrice > product.price && (
              <>
                <span className="qv-price-original">৳{product.cuttedPrice.toLocaleString()}</span>
                <span className="qv-discount-badge">
                  {getDiscount(product.price, product.cuttedPrice)}% OFF
                </span>
              </>
            )}
          </div>

          <div
            className="qv-description text-secondary text-sm overflow-hidden"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.6
            }}
            dangerouslySetInnerHTML={{ __html: product.description }}
          />

          <div className="qv-actions">
            <button
              className="btn-qv-primary flex items-center justify-center gap-2"
              onClick={itemInCart ? goToCart : () => addToCartHandler(product._id)}
            >
              <ShoppingBagOutlinedIcon fontSize="small" />
              {itemInCart ? "GO TO CART" : "ADD TO CART"}
            </button>
            <button className="btn-qv-secondary flex items-center justify-center gap-2" onClick={goToProduct}>
              VIEW FULL DETAILS
              <ArrowForwardIcon fontSize="small" />
            </button>
          </div>
        </aside>
      </div>
    </Dialog>
  );
};

export default QuickViewDialog;
