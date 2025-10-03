import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import axios from "axios";

// MUI Icons
import FlashOnIcon from "@mui/icons-material/FlashOn";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StarIcon from "@mui/icons-material/Star";
// import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
// import WaterDropIcon from "@mui/icons-material/WaterDrop";
import MenuBookIcon from "@mui/icons-material/MenuBook";
// import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";

// MUI Components
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating,
  Tab,
  Tabs,
  TextField,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

// Components
// import { NextBtn, PreviousBtn } from "../Home/DealSlider/SliderButtons";
import Breadcrumb from "../Layouts/Breadcrumb";
import Loader from "../Layouts/Loader";
import MetaData from "../Layouts/MetaData";
import OptimizedImg from "../common/OptimizedImg";

// Actions
import { addItemsToCart } from "../../actions/cartAction";
import { myOrders } from "../../actions/orderAction";
import {
  clearErrors,
  getProductDetails,
  getSimilarProducts,
  newReview,
} from "../../actions/productAction";
import { loginUser, registerUser } from "../../actions/userAction";
// import {
//   addToWishlist,
//   removeFromWishlist,
// } from "../../actions/wishlistAction";

// Constants
import { NEW_REVIEW_RESET } from "../../constants/productConstants";

// Utils
import { getDiscount } from "../../utils/functions";
import { generateProductSlug, slugify } from "../../utils/slugify";
import DealSlider from "../Home/DealSlider/DealSlider";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ProductDetails = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [viewAll, setViewAll] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedImageUrl, setSelectedImageUrl] = useState(
    location.state?.selectedImageUrl || null
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  // const [name, setName] = useState("");
  const [hasTriedLogin, setHasTriedLogin] = useState(false);

  // Add avatar URLs for picker (same as Register.jsx)
  const notebookAvatars = [
    "https://img.icons8.com/ios-filled/100/000000/user-male-circle.png",
    "https://img.icons8.com/ios-filled/100/000000/user-female-circle.png",
    "https://img.icons8.com/ios-filled/100/000000/astronaut.png",
    "https://img.icons8.com/ios-filled/100/000000/cat-profile.png",
    "https://img.icons8.com/ios-filled/100/000000/robot-2.png",
    "https://img.icons8.com/ios-filled/100/000000/reading.png",
  ];

  // Add registration state for all fields
  const [registerUserData, setRegisterUserData] = useState({
    name: "",
    email: "",
    gender: "",
    password: "",
    cpassword: "",
  });
  const [selectedAvatar, setSelectedAvatar] = useState(notebookAvatars[0]);

  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );
  const { success, error: reviewError } = useSelector(
    (state) => state.newReview
  );
  const { cartItems } = useSelector((state) => state.cart);
  // const { wishlistItems } = useSelector((state) => state.wishlist);
  const { isAuthenticated, error: userError } = useSelector(
    (state) => state.user
  );
  const { orders } = useSelector((state) => state.myOrders);

  const [checkingOrders, setCheckingOrders] = useState(false);

  // slick settings removed (not currently used)

  // Slug-based productId resolution
  const [resolvedProductId, setResolvedProductId] = useState(null);

  useEffect(() => {
    const resolveIdFromSlug = async () => {
      const idParam = params.id;
      const isValidId = idParam && /^[a-fA-F0-9]{24}$/.test(idParam);
      if (!isValidId && idParam) {
        try {
          const keyword = String(idParam).split("/").pop();
          const apiBase = process.env.REACT_APP_BACKEND_URL || "";
          const { data } = await axios.get(
            `${apiBase}/api/v1/products?keyword=${encodeURIComponent(keyword)}`
          );
          const items = data?.products || [];
          const match =
            items.find((p) => slugify(p.name) === keyword) || items[0];
          if (match?._id) {
            setResolvedProductId(match._id);
          } else {
            setResolvedProductId(null);
          }
        } catch (e) {
          console.error("Failed to resolve product by slug", e);
          setResolvedProductId(null);
        }
      } else {
        setResolvedProductId(null);
      }
    };
    resolveIdFromSlug();
  }, [params.id]);

  // Redirect numeric ID URLs to slug URL when product is loaded
  useEffect(() => {
    if (
      product &&
      params.id &&
      /^[a-fA-F0-9]{24}$/.test(params.id) &&
      product._id === params.id
    ) {
      const slug = generateProductSlug(product);
      if (slug && location.pathname !== `/product/${slug}`) {
        navigate(`/product/${slug}`, {
          replace: true,
          state: { selectedImageUrl },
        });
      }
    }
  }, [product, params.id, navigate, location.pathname, selectedImageUrl]);

  const isParamIdValid = params.id && /^[a-fA-F0-9]{24}$/.test(params.id);
  const productId = isParamIdValid ? params.id : resolvedProductId;
  // const itemInWishlist = productId ? wishlistItems.some((i) => i.product === productId) : false;
  const itemInCart = productId
    ? cartItems.some((i) => i.product === productId)
    : false;

  const extractYouTubeId = (url) => {
    if (!url) return null;

    // Handle embed URLs
    if (url.includes("/embed/")) {
      let match = url.match(/\/embed\/([\w-]{11})/);
      return match ? match[1] : null;
    }

    // Handle YouTube Shorts URLs
    if (url.includes("/shorts/")) {
      let match = url.match(/\/shorts\/([\w-]{11})/);
      return match ? match[1] : null;
    }

    // Handle various YouTube URL formats
    const patterns = [
      /(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([\w-]{11})/,
      /youtube\.com\/watch\?.*v=([\w-]{11})/,
      /youtu\.be\/([\w-]{11})/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }

    return null;
  };

  // const playVideo = () => {
  //   if (sliderRef.current) {
  //     sliderRef.current.slickPause();
  //   }
  //   setIsVideoPlaying(true);
  // };

  // const pauseVideo = () => {
  //   setIsVideoPlaying(false);
  //   if (sliderRef.current) {
  //     sliderRef.current.slickPlay();
  //   }
  // };

  // const toggleVideoPlayback = () => {
  //   if (isVideoPlaying) {
  //     pauseVideo();
  //   } else {
  //     playVideo();
  //   }
  // };

  // const handleTabChange = (event, newValue) => {
  //   setActiveTab(newValue);
  // };

  // const addToWishlistHandler = () => {
  //   if (itemInWishlist) {
  //     dispatch(removeFromWishlist(productId));
  //     enqueueSnackbar("Removed From Wishlist", { variant: "success" });
  //   } else {
  //     dispatch(addToWishlist(productId));
  //     enqueueSnackbar("Added To Wishlist", { variant: "success" });
  //   }
  // };

  const handleRateProductClick = async () => {
    if (!isAuthenticated) {
      setLoginOpen(true);
      return;
    }

    setCheckingOrders(true);
    try {
      await dispatch(myOrders());

      // Wait a short moment for the state to update
      setTimeout(() => {
        const hasOrderedProduct = orders?.some((order) =>
          order.orderItems?.some((item) => item.product === productId)
        );

        if (!hasOrderedProduct) {
          enqueueSnackbar(
            "You need to purchase this product first to rate it",
            {
              variant: "warning",
            }
          );
          setCheckingOrders(false);
          return;
        }

        setOpen(true);
        setCheckingOrders(false);
      }, 100);
    } catch (error) {
      enqueueSnackbar("Error checking order history", { variant: "error" });
      setCheckingOrders(false);
    }
  };

  const reviewSubmitHandler = () => {
    if (rating === 0 || !comment.trim()) {
      enqueueSnackbar("Please provide both rating and comment", {
        variant: "error",
      });
      return;
    }
    const formData = new FormData();
    formData.set("rating", rating);
    formData.set("comment", comment);
    formData.set("productId", productId);
    dispatch(newReview(formData));
    setOpen(false);
  };

  // If we arrived with a specific selectedImageUrl, align both selectedImageUrl and currentSlide to it
  useEffect(() => {
    const incoming = location.state?.selectedImageUrl;
    if (incoming && product?.images?.length) {
      const idx = product.images.findIndex((img) => img.url === incoming);
      if (idx >= 0) {
        setSelectedImageUrl(incoming);
        setCurrentSlide(idx);
      }
    }
  }, [location.state, product]);

  const addToCartHandler = React.useCallback(() => {
    if (!productId) return;
    dispatch(addItemsToCart(productId, 1, selectedImageUrl));
    enqueueSnackbar("Product Added To Cart", { variant: "success" });
  }, [dispatch, productId, selectedImageUrl, enqueueSnackbar]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setHasTriedLogin(true);
    dispatch(loginUser(email, password));
  };

  // const handleSignupSubmit = (e) => {
  //   e.preventDefault();
  //   navigate(`/register?redirect=product/${productId}`);
  // };

  const handleDialogClose = () => {
    setOpen(!open);
  };

  const handleLoginDialogClose = () => {
    setLoginOpen(false);
    setEmail("");
    setPassword("");
    setShowRegister(false);
  };

  const toggleAuthMode = () => {
    setShowRegister(!showRegister);
    setEmail("");
    setPassword("");
    // setName("");
  };

  const goToCart = () => {
    navigate("/cart");
  };

  const buyNow = () => {
    if (isAuthenticated) {
      addToCartHandler();
      navigate("/shipping");
    } else {
      // For non-authenticated users, add to cart and go to guest checkout
      addToCartHandler();
      navigate("/guest-checkout");
    }
  };

  // Registration validation and handler
  const handleRegisterModal = (e) => {
    e.preventDefault();
    if (registerUserData.password.length < 8) {
      enqueueSnackbar("Password must be at least 8 characters", {
        variant: "warning",
      });
      return;
    }
    if (registerUserData.password !== registerUserData.cpassword) {
      enqueueSnackbar("Passwords don't match", { variant: "error" });
      return;
    }
    if (!registerUserData.gender) {
      enqueueSnackbar("Please select your gender", { variant: "warning" });
      return;
    }
    const formData = new FormData();
    formData.set("name", registerUserData.name);
    formData.set("email", registerUserData.email);
    formData.set("gender", registerUserData.gender);
    formData.set("password", registerUserData.password);
    formData.set("avatar", selectedAvatar);
    dispatch(registerUser(formData));
  };

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    if (reviewError) {
      enqueueSnackbar(reviewError, { variant: "error" });
      dispatch(clearErrors());
    }
    if (userError && hasTriedLogin) {
      enqueueSnackbar(userError, { variant: "error" });
      dispatch(clearErrors());
    }
    if (success) {
      enqueueSnackbar("Review Submitted Successfully", { variant: "success" });
      dispatch({ type: NEW_REVIEW_RESET });
    }
    if (productId) dispatch(getProductDetails(productId));
  }, [
    dispatch,
    productId,
    error,
    reviewError,
    userError,
    success,
    enqueueSnackbar,
    hasTriedLogin,
  ]);

  useEffect(() => {
    if (product?.category) {
      dispatch(getSimilarProducts(product.category));
    }
  }, [dispatch, product]);

  useEffect(() => {
    if (isAuthenticated && loginOpen) {
      handleLoginDialogClose();
      addToCartHandler();
      navigate("/shipping");
    }
  }, [isAuthenticated, loginOpen, addToCartHandler, navigate]);

  if (loading) return <Loader />;

  return (
    <>
      <MetaData title={product?.name || "Product Details"} />
      <Breadcrumb product={product} />
      <main
        style={{ background: "var(--primary-bg)" }}
        className="min-h-screen"
      >
        {/* Important: Do NOT add any overflow-hidden or overflow-x-hidden here, or sticky will break! */}
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-0 px-0 md:px-0">
          {/* Left: Responsive Image Gallery */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start">
            {/* Images container: relative for desktop */}
            <div className="w-full flex-1 flex flex-col relative">
              {/* Main image (all screens) */}
              <div className="block w-full aspect-[1/1] max-w-3xl mx-auto bg-[var(--primary-bg)] rounded-xl flex items-center justify-center p-8 sm:p-12">
                {product?.images?.[currentSlide] && (
                  <div
                    className="image-zoom-pan rounded-xl w-full h-full flex items-center justify-center"
                    onMouseEnter={(e) =>
                      e.currentTarget.classList.add("zoomed")
                    }
                    onMouseLeave={(e) =>
                      e.currentTarget.classList.remove("zoomed")
                    }
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = ((e.clientX - rect.left) / rect.width) * 100;
                      const y = ((e.clientY - rect.top) / rect.height) * 100;
                      e.currentTarget.style.setProperty("--x", `${x}%`);
                      e.currentTarget.style.setProperty("--y", `${y}%`);
                      e.currentTarget.style.setProperty("--zoom", 2);
                    }}
                    onTouchStart={(e) =>
                      e.currentTarget.classList.add("zoomed")
                    }
                    onTouchEnd={(e) =>
                      e.currentTarget.classList.remove("zoomed")
                    }
                    onTouchMove={(e) => {
                      const touch = e.touches[0];
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x =
                        ((touch.clientX - rect.left) / rect.width) * 100;
                      const y =
                        ((touch.clientY - rect.top) / rect.height) * 100;
                      e.currentTarget.style.setProperty("--x", `${x}%`);
                      e.currentTarget.style.setProperty("--y", `${y}%`);
                      e.currentTarget.style.setProperty("--zoom", 2);
                    }}
                  >
                    <OptimizedImg
                      src={product.images[currentSlide].url}
                      alt={product?.name || "Product image"}
                      className="max-w-full max-h-full object-contain rounded-xl"
                      onLoad={() =>
                        setSelectedImageUrl(product.images[currentSlide].url)
                      }
                      draggable={false}
                      quality="85"
                      format="auto"
                      placeholder="blur"
                      priority={true}
                    />
                  </div>
                )}
              </div>
              {/* Thumbnails row (all screens) */}
              <div className="flex flex-row gap-3 mt-3 w-full justify-center px-2 flex-wrap">
                {product?.images?.map((item, i) => (
                  <OptimizedImg
                    key={`thumb-mobile-${i}`}
                    src={item?.url || ""}
                    alt={product?.name || "Product thumbnail"}
                    className={`w-16 h-16 object-cover rounded border-2 ${
                      currentSlide === i
                        ? "border-[var(--primary-blue-dark)]"
                        : "border-[var(--primary-blue-light)] opacity-70"
                    } cursor-pointer transition-all duration-200 hover:opacity-90`}
                    onClick={() => {
                      setCurrentSlide(i);
                      setSelectedImageUrl(item?.url || null);
                    }}
                    style={{ background: "var(--primary-bg)" }}
                    quality="70"
                    format="auto"
                    placeholder="blur"
                  />
                ))}
              </div>
              {/* Removed desktop column layout; unified row thumbnails + single main image */}
            </div>
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
            {/* {typeof product?.stock === "number" && product.stock > 0 && (
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
                  {product.stock < 10
                    ? product.stock === 1
                              ? "Hurry, Only 1 item left!"
        : `Hurry, Only ${product.stock} items left!`
                    : product.stock === 1
                            ? "1 items left"
        : `${product.stock} items left`}
                </span>
                <div className="flex-1 h-2 rounded bg-gray-200 overflow-hidden">
                  <div
                    className="h-full rounded transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(10, product.stock * 10)
                      )}%`,
                      background:
                        product.stock < 5
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

            {product?.isDifferentColors && product?.images?.length > 1 && (
              <div className="mb-3">
                <div className="text-sm font-semibold text-[var(--primary-blue-dark)] mb-2">
                  Select Color
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <button
                        onClick={() => {
                          setCurrentSlide(idx);
                          setSelectedImageUrl(img.url);
                          const el = document.getElementById(
                            `product-img-${idx}`
                          );
                          if (el)
                            el.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                        }}
                        className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 ${
                          selectedImageUrl === img.url
                            ? "border-[var(--brand-yellow)]"
                            : "border-[var(--primary-blue-light)]"
                        } overflow-hidden`}
                        aria-label={`Color ${idx + 1}`}
                      >
                        <img
                          src={img.url}
                          alt={`Color ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                      <span
                        className={`absolute left-1/2 -translate-x-1/2 -top-2 -translate-y-full px-2 py-1 text-[11px] rounded bg-[var(--brand-yellow)] text-[#0f172a] shadow pointer-events-none transition-opacity duration-150 whitespace-nowrap ${
                          selectedImageUrl === img.url
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        {selectedImageUrl === img.url ? "✓ Selected" : "Select"}
                      </span>
                      <span
                        className={`absolute left-1/2 -translate-x-1/2 -top-[6px] -translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent ${
                          selectedImageUrl === img.url
                            ? "border-t-[var(--brand-yellow)] opacity-100"
                            : "border-t-[var(--brand-yellow)] opacity-0 group-hover:opacity-100"
                        }`}
                      ></span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video Section */}
            {product?.video_url && extractYouTubeId(product.video_url) && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-[var(--primary-blue-dark)] mb-3 flex items-center gap-2">
                  <PlayCircleOutlineIcon
                    sx={{ color: "var(--primary-blue-light)" }}
                  />
                  Product Video
                </h3>
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-[var(--section-bg)] shadow-lg">
                  <iframe
                    id="youtube-player"
                    src={`https://www.youtube.com/embed/${extractYouTubeId(
                      product.video_url
                    )}?enablejsapi=1&origin=${
                      window.location.origin
                    }&rel=0&modestbranding=1`}
                    title="Product Video"
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <p className="text-xs text-[var(--primary-blue-dark)] opacity-70 mt-2 text-center">
                  Watch this product in action
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 my-4">
              {product?.stock > 0 && (
                <button
                  onClick={itemInCart ? goToCart : addToCartHandler}
                  className="flex-1 py-3 flex items-center justify-center gap-2 rounded-full bg-[var(--button-bg)] text-white font-bold border border-[var(--primary-blue-light)] hover:bg-[var(--primary-blue-dark)] hover:text-white transition-all"
                >
                  <ShoppingCartIcon fontSize="small" />
                  {itemInCart ? "GO TO CART" : "ADD TO CART"}
                </button>
              )}
              <button
                onClick={buyNow}
                disabled={product?.stock < 1}
                className={`flex-1 py-3 flex items-center justify-center gap-2 rounded-full font-bold border border-[var(--primary-blue-light)] transition-all ${
                  product?.stock < 1
                    ? "bg-[var(--section-bg)] text-[var(--primary-blue-dark)] opacity-60 cursor-not-allowed"
                    : "bg-[var(--primary-blue-light)] text-white hover:bg-[var(--primary-blue-dark)] hover:text-white"
                }`}
              >
                <FlashOnIcon fontSize="small" />
                {product?.stock < 1 ? "OUT OF STOCK" : "BUY NOW"}
              </button>
            </div>

            {/* Product Information Tabs */}
            <div className="mt-6">
              <Tabs
                value={activeTab}
                onChange={(e, v) => setActiveTab(v)}
                aria-label="product info tabs"
                textColor="inherit"
                sx={{
                  "& .MuiTabs-indicator": {
                    backgroundColor: "var(--brand-yellow)",
                  },
                  "& .MuiTab-root": {
                    color: "var(--primary-blue-dark)",
                    textTransform: "none",
                    fontWeight: 700,
                  },
                  "& .Mui-selected": { color: "var(--primary-blue-dark)" },
                }}
              >
                <Tab label="Details" {...a11yProps(0)} />
                <Tab label="Specifications" {...a11yProps(1)} />
                <Tab
                  label={`Reviews (${product?.numOfReviews || 0})`}
                  {...a11yProps(2)}
                />
              </Tabs>

              <TabPanel value={activeTab} index={0}>
                {product?.description ? (
                  <div
                    className="prose max-w-none text-[var(--primary-blue-dark)]"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                    {product?.highlights?.map((highlight, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-[var(--primary-blue-light)] font-bold">
                          •
                        </span>
                        <span className="text-[var(--primary-blue-dark)] text-sm">
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </TabPanel>

              <TabPanel value={activeTab} index={1}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                  {product?.specifications?.map((spec, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-[var(--primary-blue-light)] font-bold">
                        {spec.title}:
                      </span>
                      <span className="text-[var(--primary-blue-dark)] text-sm">
                        {spec.description}
                      </span>
                    </div>
                  ))}
                </div>
              </TabPanel>

              <TabPanel value={activeTab} index={2}>
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                  <h3 className="text-2xl font-bold text-[var(--primary-blue-dark)]">
                    Ratings & Reviews
                  </h3>
                  <button
                    onClick={handleRateProductClick}
                    disabled={checkingOrders}
                    className="rounded-full px-6 py-2 bg-white text-[var(--primary-blue-light)] font-bold border border-[var(--primary-blue-dark)] hover:bg-[var(--primary-blue-dark)] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {checkingOrders ? "Checking..." : "Rate Product"}
                  </button>
                </div>
                <div className="flex items-center border-b pb-2 mb-4">
                  <h2 className="text-3xl font-bold text-[var(--primary-blue-light)] flex items-center">
                    {product?.ratings?.toFixed(1) || 0}
                    <StarIcon
                      sx={{
                        fontSize: "inherit",
                        verticalAlign: "middle",
                        color: "var(--primary-blue-light)",
                      }}
                    />
                  </h2>
                  <p className="text-lg text-[var(--primary-blue-dark)] ml-2">
                    ({product?.numOfReviews || 0}) Reviews
                  </p>
                </div>
                {product?.reviews?.length > 0 ? (
                  <>
                    {(viewAll
                      ? product.reviews
                      : product.reviews.slice(0, 3)
                    ).map((rev, i) => (
                      <div
                        key={i}
                        className="flex flex-col gap-2 py-4 px-0 border-b last:border-b-0"
                      >
                        <Rating
                          name={`read-only-rating-${i}`}
                          value={rev.rating}
                          readOnly
                          size="small"
                          precision={0.5}
                        />
                        <p className="text-[var(--primary-blue-dark)]">
                          {rev.comment}
                        </p>
                        <span className="text-sm text-[var(--primary-blue-light)]">
                          by {rev.name}
                        </span>
                      </div>
                    ))}
                    {product.reviews.length > 3 && (
                      <div className="mt-4 flex justify-center">
                        <button
                          onClick={() => setViewAll(!viewAll)}
                          className="w-auto m-2 rounded-full py-2 px-4 bg-[var(--primary-blue-light)] text-white font-bold hover:bg-[var(--primary-blue-dark)] hover:text-white"
                        >
                          {viewAll ? "View Less Reviews" : "View All Reviews"}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="py-4 px-0 text-[var(--primary-blue-light)]">
                    No reviews yet. Be the first to rate this product!
                  </p>
                )}
              </TabPanel>
            </div>
            {/* Review Dialog */}
            <Dialog open={open} onClose={handleDialogClose}>
              <DialogTitle className="border-b text-[var(--primary-blue-dark)] font-bold">
                Submit Review
              </DialogTitle>
              <DialogContent
                className="flex flex-col m-1 gap-4"
                sx={{ opacity: 1 }}
              >
                <Rating
                  onChange={(e) => setRating(e.target.value)}
                  value={rating}
                  size="large"
                  precision={0.5}
                />
                <TextField
                  label="Review"
                  multiline
                  rows={3}
                  sx={{ width: { xs: "100%", sm: 400 } }}
                  size="small"
                  variant="outlined"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </DialogContent>
              <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
                <button
                  onClick={handleDialogClose}
                  className="py-2 px-6 rounded-full bg-white border border-red-500 hover:bg-red-100 text-red-600 uppercase"
                >
                  Cancel
                </button>
                <button
                  onClick={reviewSubmitHandler}
                  className="py-2 px-6 rounded-full bg-[var(--primary-blue-light)] hover:bg-[var(--primary-blue-dark)] text-white uppercase"
                >
                  Submit
                </button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
        <DealSlider />
      </main>

      <Dialog
        open={loginOpen}
        onClose={handleLoginDialogClose}
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 2,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(12px)",
            boxShadow:
              "0 15px 35px rgba(0, 100, 255, 0.3), 0 5px 15px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
            width: { xs: "95vw", sm: "450px", md: "800px" },
            maxHeight: "95vh",
            height: "auto",
            display: "flex",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            height: { md: showRegister ? "520px" : "450px" },
            opacity: 1,
          }}
        >
          {/* In the modal, update the left side to match Login.jsx branding */}
          <Box
            sx={{
              flex: 1,
              p: { xs: 2, md: 6 },
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#ffffff",
              background: "#ffffff",
              color: "#0f172a",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "none",
              }}
            />
            <Avatar
              sx={{
                m: 2,
                bgcolor: "var(--brand-yellow)",
                color: "#0f172a",
                width: 80,
                height: 80,
                boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
              }}
            >
              <MenuBookIcon sx={{ fontSize: 50, color: "#0f172a" }} />
            </Avatar>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              fontWeight="bold"
              sx={{
                textShadow: "0 2px 4px rgba(0,0,0,0.08)",
                color: "#0f172a",
              }}
            >
              Welcome to Flan
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ mb: 4, maxWidth: "80%", color: "#334155" }}
            >
              Fandom Merchandise, Express Yourself
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Typography
                variant="body1"
                sx={{ mb: 2, fontWeight: 400, color: "#0f172a" }}
              >
                • Premium anime merchandise
              </Typography>
              <Typography
                variant="body1"
                sx={{ mb: 2, fontWeight: 400, color: "#0f172a" }}
              >
                • Authentic fandom designs
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 400, color: "#0f172a" }}
              >
                • Products fans love
              </Typography>
            </Box>
          </Box>
          {/* For the right side, ensure content is never cut off and is scrollable if needed */}
          <Box
            sx={{
              flex: 1,
              p: { xs: 2, sm: 4, md: 5 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              maxHeight: { xs: "90vh", md: "95vh" },
              height: "auto",
              overflowY: "auto",
              pb: 4,
            }}
          >
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 600,
                mb: 0.5,
                color: "var(--primary-blue-dark)",
              }}
            >
              {showRegister ? "Create an Account" : "Login to Continue"}
            </Typography>
            <Typography
              variant="body2"
              sx={{ mb: 3, color: "var(--primary-blue-light)" }}
            >
              {showRegister
                ? "Sign up to complete your purchase"
                : "Please login to proceed with your purchase"}
            </Typography>
            {showRegister ? (
              <Box component="form" onSubmit={handleRegisterModal}>
                <TextField
                  margin="normal"
                  fullWidth
                  label="Full Name"
                  type="text"
                  value={registerUserData.name}
                  onChange={(e) =>
                    setRegisterUserData({
                      ...registerUserData,
                      name: e.target.value,
                    })
                  }
                  required
                  sx={{ mb: 2 }}
                  InputProps={{ sx: { borderRadius: 1.5, bgcolor: "white" } }}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={registerUserData.email}
                  onChange={(e) =>
                    setRegisterUserData({
                      ...registerUserData,
                      email: e.target.value,
                    })
                  }
                  required
                  sx={{ mb: 2 }}
                  InputProps={{ sx: { borderRadius: 1.5, bgcolor: "white" } }}
                />
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    fontWeight="medium"
                    color="var(--text-secondary)"
                    mb={0.5}
                  >
                    Your Gender
                  </Typography>
                  <RadioGroup
                    row
                    name="gender"
                    value={registerUserData.gender}
                    onChange={(e) =>
                      setRegisterUserData({
                        ...registerUserData,
                        gender: e.target.value,
                      })
                    }
                    sx={{ ml: 0.5 }}
                  >
                    <FormControlLabel
                      value="male"
                      control={<Radio required size="small" />}
                      label="Male"
                    />
                    <FormControlLabel
                      value="female"
                      control={<Radio required size="small" />}
                      label="Female"
                    />
                  </RadioGroup>
                </Box>
                <TextField
                  margin="normal"
                  fullWidth
                  label="Password"
                  type="password"
                  value={registerUserData.password}
                  onChange={(e) =>
                    setRegisterUserData({
                      ...registerUserData,
                      password: e.target.value,
                    })
                  }
                  required
                  sx={{ mb: 2 }}
                  InputProps={{ sx: { borderRadius: 1.5, bgcolor: "white" } }}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  value={registerUserData.cpassword}
                  onChange={(e) =>
                    setRegisterUserData({
                      ...registerUserData,
                      cpassword: e.target.value,
                    })
                  }
                  required
                  sx={{ mb: 2 }}
                  InputProps={{ sx: { borderRadius: 1.5, bgcolor: "white" } }}
                />
                <Box sx={{ mb: 2.5 }}>
                  <Typography
                    variant="body2"
                    mb={0.75}
                    color="var(--text-secondary)"
                    fontSize="0.85rem"
                  >
                    Select your profile avatar
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 2,
                      justifyContent: {
                        xs: "flex-start",
                        sm: "flex-start",
                        md: "flex-start",
                      },
                    }}
                  >
                    {notebookAvatars.map((url, idx) => (
                      <Avatar
                        key={url}
                        src={url}
                        alt={`Avatar ${idx + 1}`}
                        sx={{
                          width: 48,
                          height: 48,
                          border:
                            selectedAvatar === url
                              ? "3px solid var(--primary-blue-dark)"
                              : "2px solid #ccc",
                          cursor: "pointer",
                          transition: "border 0.2s",
                          boxShadow:
                            selectedAvatar === url ? "0 0 8px #bde0fe" : "none",
                          mb: { xs: 1, sm: 0 },
                        }}
                        onClick={() => setSelectedAvatar(url)}
                      />
                    ))}
                  </Box>
                </Box>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  className="glass-button"
                  sx={{
                    py: 1,
                    fontSize: { xs: "0.95rem", sm: "1rem" },
                    background:
                      "linear-gradient(45deg, var(--primary-blue-dark) 30%, var(--primary-blue-light) 90%)",
                    mb: 1.5,
                    mt: { xs: 1, sm: 0 },
                    borderRadius: 2,
                    boxShadow: "0 4px 24px 0 rgba(40,116,240,0.08)",
                    "&:hover": {
                      background:
                        "linear-gradient(45deg, var(--primary-blue-dark) 30%, var(--primary-blue-light) 90%)",
                    },
                  }}
                >
                  Create Account
                </Button>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleLoginSubmit}>
                <TextField
                  margin="normal"
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  sx={{ mb: 2 }}
                  InputProps={{ sx: { borderRadius: 1.5, bgcolor: "white" } }}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  sx={{ mb: 3 }}
                  InputProps={{ sx: { borderRadius: 1.5, bgcolor: "white" } }}
                />
                <button
                  type="submit"
                  className="w-full py-2 mt-1 mb-2 rounded-full text-[var(--primary-blue-dark)] font-bold text-sm shadow hover:bg-[var(--primary-blue-light)] hover:text-white transition-all duration-200 glass-card border border-[var(--primary-blue-light)]"
                >
                  Login
                </button>
              </Box>
            )}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
              <button
                type="button"
                onClick={toggleAuthMode}
                className="text-[var(--primary-blue-dark)] font-bold text-sm shadow hover:bg-[var(--primary-blue-light)] hover:text-white transition-all duration-200 glass-card border border-[var(--primary-blue-light)] rounded-full px-4 py-2"
              >
                {showRegister
                  ? "Already have an account? Login"
                  : "New user? Create an account"}
              </button>
            </Box>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default ProductDetails;

