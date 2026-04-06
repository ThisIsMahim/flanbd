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

            <div className="product-price-row">
              <span className="product-current-price">৳{product.price?.toLocaleString()}</span>
              {hasDiscount && (
                <>
                  <span className="product-old-price">৳{product.cuttedPrice?.toLocaleString()}</span>
                  <span className="product-discount-tag">-{getDiscount(product.price, product.cuttedPrice)}%</span>
                </>
              )}
            </div>

            {product.description && (
              <p className="product-short-desc">
                {product.description.replace(/<[^>]*>/g, '').substring(0, 200)}...
              </p>
            )}

            {/* Colors */}
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

            <div className="product-actions">
              <button className="btn-add-cart" onClick={itemInCart ? () => navigate('/cart') : addToCartHandler}>
                <ShoppingCartIcon />
                {itemInCart ? "View in Cart" : "Add to Cart"}
              </button>
              <button className="btn-buy-now" onClick={buyNow} disabled={product.stock < 1}>
                <FlashOnIcon />
                {product.stock < 1 ? "Out of Stock" : "Buy It Now"}
              </button>
            </div>

            <ProductHighlightsBlock highlights={product.highlights} />
          </div>
        </div>

        {/* Details & Reviews */}
        <section className="product-bottom-section">
          <div className="product-details-tabs">
            <nav className="flex gap-8">
              {['Description', 'Specifications', `Reviews (${product.numOfReviews})`].map((tab, i) => (
                <button
                  key={i}
                  className={`py-4 font-bold border-b-2 transition-all ${activeTab === i ? 'border-accent text-primary' : 'border-transparent text-muted'}`}
                  onClick={() => setActiveTab(i)}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="tab-content">
            {activeTab === 0 && <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />}
            {activeTab === 1 && <ProductInfoBlock product={product} />}
            {activeTab === 2 && <ProductReviewsBlock product={product} />}
          </div>
        </section>

        {/* Similar Products */}
        <DealSlider title="Similar Products" />
      </main>
    </>
  );
};

export default ProductDetails;
