import { useSnackbar } from "notistack";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";

// MUI
import { Rating } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StarIcon from "@mui/icons-material/Star";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";

// Components
import Breadcrumb from "../Layouts/Breadcrumb";
import Loader from "../Layouts/Loader";
import MetaData from "../Layouts/MetaData";
import OptimizedImg from "../common/OptimizedImg";
import DealSlider from "../Home/DealSlider/DealSlider";
import ProductHighlightsBlock from "./ProductHighlightsBlock";
import ProductInfoBlock from "./ProductInfoBlock";
import ProductReviewsBlock from "./ProductReviewsBlock";

// Actions
import { addItemsToCart } from "../../actions/cartAction";
import { clearErrors, getProductDetails, getSimilarProducts } from "../../actions/productAction";

// Utils
import { getDiscount } from "../../utils/functions";
import { generateProductSlug, slugify } from "../../utils/slugify";

import "./ProductDetails.css";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedImageUrl, setSelectedImageUrl] = useState(location.state?.selectedImageUrl || null);
  const [resolvedProductId, setResolvedProductId] = useState(null);

  const { product, loading, error } = useSelector((state) => state.productDetails);
  const { cartItems } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.user);

  // Resolve ID from slug if necessary
  useEffect(() => {
    const resolveIdFromSlug = async () => {
      const idParam = params.id;
      const isValidId = idParam && /^[a-fA-F0-9]{24}$/.test(idParam);
      if (!isValidId && idParam) {
        try {
          const keyword = String(idParam).split("/").pop();
          const apiBase = process.env.REACT_APP_BACKEND_URL || "";
          const { data } = await axios.get(`${apiBase}/api/v1/products?keyword=${encodeURIComponent(keyword)}`);
          const items = data?.products || [];
          const match = items.find((p) => slugify(p.name) === keyword) || items[0];
          if (match?._id) setResolvedProductId(match._id);
        } catch (e) {
          console.error("Failed to resolve product by slug", e);
        }
      }
    };
    resolveIdFromSlug();
  }, [params.id]);

  const productId = params.id && /^[a-fA-F0-9]{24}$/.test(params.id) ? params.id : resolvedProductId;
  const itemInCart = productId ? cartItems.some((i) => i.product === productId) : false;

  // Category detection
  const displayCategory = product?.categories?.[0]?.name || product?.category || (product?.brand?.name ? "" : "General");

  useEffect(() => {
    if (productId) dispatch(getProductDetails(productId));
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
  }, [dispatch, productId, error, enqueueSnackbar]);

  useEffect(() => {
    if (product?.category) {
      dispatch(getSimilarProducts(product.category));
    }
    if (product?.images?.length && !selectedImageUrl) {
      setSelectedImageUrl(product.images[0].url);
    }
  }, [dispatch, product, selectedImageUrl]);

  const addToCartHandler = useCallback(() => {
    const id = productId || product?._id;
    if (!id) return;
    dispatch(addItemsToCart(id, 1, selectedImageUrl));
    enqueueSnackbar("Added to cart", { variant: "success" });
  }, [dispatch, productId, product, selectedImageUrl, enqueueSnackbar]);

  const buyNow = () => {
    addToCartHandler();
    navigate(isAuthenticated ? "/shipping" : "/guest-checkout");
  };

  if (loading || !product) return <Loader />;

  const hasDiscount = product.cuttedPrice > product.price;

  return (
    <>
      <MetaData title={product.name} />
      <main className="product-details-container mt-24">
        <Breadcrumb product={product} />
        <div className="product-main-row">
          {/* Left: Gallery */}
          <div className="product-gallery">
            <div className="product-thumbnails">
              {product.images?.map((img, i) => (
                <div
                  key={i}
                  className={`product-thumb ${currentSlide === i ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentSlide(i);
                    setSelectedImageUrl(img.url);
                  }}
                >
                  <img src={img.url} alt={`Thumbnail ${i}`} />
                </div>
              ))}
            </div>

            <div className="product-main-image">
              <OptimizedImg src={selectedImageUrl || product.images?.[0]?.url} alt={product.name} priority />
            </div>
          </div>

          {/* Right: Info */}
          <div className="product-info-col">
            <div className="product-brand-cat">
              {product.brand?.name ? `${product.brand.name} • ` : ""}{displayCategory}
            </div>
            <h1 className="product-title">{product.name}</h1>

            <div className="flex items-center gap-2 mb-2">
              <Rating value={product.ratings || 0} precision={0.5} readOnly size="small" />
              <span className="text-sm text-secondary">({product.numOfReviews || 0} reviews)</span>
            </div>

            <div className="product-price-row mt-6">
              <span className="product-current-price">৳{product.price?.toLocaleString()}</span>
              {hasDiscount && (
                <div className="product-price-info-group">
                  <span className="product-old-price">৳{product.cuttedPrice?.toLocaleString()}</span>
                  <span className="product-discount-tag">-{getDiscount(product.price, product.cuttedPrice)}% OFF</span>
                  <span className="save-amount ml-2">SAVE ৳{(product.cuttedPrice - product.price).toLocaleString()}</span>
                </div>
              )}
            </div>

            {product.description && (
              <p className="product-short-desc">
                {product.description.replace(/<[^>]*>/g, '').substring(0, 250)}...
              </p>
            )}

            {/* Variations */}
            {product.images?.length > 1 && (
              <div className="color-selector">
                <span className="selector-label">Available Variations</span>
                <div className="color-options">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      className={`color-option-btn ${currentSlide === i ? 'active' : ''}`}
                      onClick={() => {
                        setCurrentSlide(i);
                        setSelectedImageUrl(img.url);
                      }}
                    >
                      <img src={img.url} alt={`Variation ${i}`} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="product-actions-group">
              <div className="product-main-actions">
                <button 
                  className={`btn-add-cart ${itemInCart ? 'active' : ''}`} 
                  onClick={itemInCart ? () => navigate('/cart') : addToCartHandler}
                >
                  <ShoppingCartIcon fontSize="small" />
                  {itemInCart ? "View in Cart" : "Add to Cart"}
                </button>
                <button 
                  className="btn-buy-now" 
                  onClick={buyNow} 
                  disabled={product.stock < 1}
                >
                  <FlashOnIcon fontSize="small" />
                  {product.stock < 1 ? "Out of Stock" : "Buy It Now"}
                </button>
              </div>
              
              <div className="product-secondary-actions">
                <button className="secondary-action-btn">
                  <FavoriteBorderIcon fontSize="small" />
                  Add to Wishlist
                </button>
                <button className="secondary-action-btn">
                  <ShareIcon fontSize="small" />
                  Share
                </button>
                <button className="secondary-action-btn">
                  <CompareArrowsIcon fontSize="small" />
                  Compare
                </button>
              </div>
            </div>

            <ProductHighlightsBlock highlights={product.highlights} />
          </div>
        </div>

        {/* Bottom Details */}
        <section className="product-bottom-section">
          <div className="product-details-tabs">
            <div className="flex gap-6 md:gap-12 min-w-max">
              {['Description', 'Specifications', `Reviews (${product.numOfReviews})`].map((tab, i) => (
                <button
                  key={i}
                  className={`tab-btn ${activeTab === i ? 'active' : ''}`}
                  onClick={() => setActiveTab(i)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="tab-content">
            {activeTab === 0 && (
              <div className="animate-fade-in prose max-w-none text-secondary break-words overflow-x-hidden w-full">
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
            )}
            {activeTab === 1 && <div className="animate-fade-in"><ProductInfoBlock product={product} /></div>}
            {activeTab === 2 && <div className="animate-fade-in"><ProductReviewsBlock product={product} /></div>}
          </div>
        </section>

        {/* Similar Products */}
        <div className="mt-20 border-t border-border pt-20">
          <DealSlider title="Similar Products" />
        </div>
      </main>
    </>
  );
};

export default ProductDetails;
