import CloseIcon from "@mui/icons-material/Close";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterListIcon from "@mui/icons-material/FilterList";
import StarIcon from "@mui/icons-material/Star";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
// Removed unused MUI controls for Flan's simplified filters
import Pagination from "@mui/material/Pagination";
// Removed unused radio inputs
import Slider from "@mui/material/Slider";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { addItemsToCart } from "../../actions/cartAction";
import { clearErrors, getProducts } from "../../actions/productAction";
import DealSlider from "../Home/DealSlider/DealSlider";
import HomeContactSection from "../Home/HomeContactSection";
import ProductCard from "../Home/ProductSlider/components/ProductCard";
import QuickViewDialog from "../Home/ProductSlider/components/QuickViewDialog";
import Breadcrumb from "../Layouts/Breadcrumb";
import MetaData from "../Layouts/MetaData";
import SkeletonProduct from "./SkeletonProduct";

// Flan defaults: price step remains static; min/max will be fetched from backend
const PRICE_STEP = 100;
const FIXED_RESULT_PER_PAGE = 9; // Number of products per page

const Products = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // No auth dependency for listing

  const [isSliderMounted, setIsSliderMounted] = useState(false);
  const [category, setCategory] = useState(
    location.search
      ? new URLSearchParams(location.search).get("category") || ""
      : ""
  );
  const [brand, setBrand] = useState(
    location.search
      ? new URLSearchParams(location.search).get("brand") || ""
      : ""
  );
  const [ratings, setRatings] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  // Removed legacy toggles
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { products, loading, error } = useSelector((state) => state.products);
  const { cartItems } = useSelector((state) => state.cart);
  const keyword = params.keyword || "";

  // Add state for categories with icon
  const [categoriesData, setCategoriesData] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(200000);
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  // Removed subcategory slider UI

  // Track if products have finished loading for the current filter set
  const [hasFetched, setHasFetched] = useState(false);

  // Fetch dynamic price bounds from backend and initialize range
  useEffect(() => {
    const fetchPriceRange = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/products/price-range`);
        const data = await res.json();
        if (data?.success) {
          const min = Number(data.minPrice) || 0;
          const max = Number(data.maxPrice) || 0;
          setPriceMin(min);
          setPriceMax(max);
          setPriceRange([min, max]);
        }
      } catch (e) {
        // silently fall back to defaults
      }
    };
    fetchPriceRange();
  }, []);

  useEffect(() => {
    if (!loading) setHasFetched(true);
    else setHasFetched(false);
  }, [loading, category, brand, keyword, priceRange, ratings, currentPage]);

  // Fetch categories (with icon) from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/categories`
        );
        const data = await response.json();
        if (data.success) {
          setCategoriesData(data.categories);
        }
      } catch (error) {
        setCategoriesData([]);
      }
    };
    fetchCategories();
  }, []);

  // Remove old brands extraction from allProducts
  // Flan: no brand list prefetch

  // Flan: no category videos

  // Filter products based on selected brand and search keyword
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Consolidated product filtering logic - handles all filters including subcategories
  useEffect(() => {
    if (!Array.isArray(products)) {
      setFilteredProducts([]);
      return;
    }

    let filtered = [...products];

    // Apply brand filter if selected
    if (brand) {
      filtered = filtered.filter((product) => product.brand?.name === brand);
    }

    // Apply search keyword filter if present
    if (keyword) {
      const lowerCaseKeyword = keyword.toLowerCase();
      filtered = filtered.filter((product) => {
        // Search in product name
        const nameMatch =
          product.name && product.name.toLowerCase().includes(lowerCaseKeyword);

        // Search in product description
        const descriptionMatch =
          product.description &&
          product.description.toLowerCase().includes(lowerCaseKeyword);

        // Search in category names
        const categoryMatch =
          product.categories &&
          product.categories.some((cat) => {
            // Handle different category formats
            if (typeof cat === "string") {
              return cat.toLowerCase().includes(lowerCaseKeyword);
            } else if (cat && typeof cat === "object" && cat.name) {
              return cat.name.toLowerCase().includes(lowerCaseKeyword);
            } else {
              return false; // Skip invalid categories
            }
          });

        // Search in brand name
        const brandMatch =
          product.brand &&
          product.brand.name &&
          product.brand.name.toLowerCase().includes(lowerCaseKeyword);

        return nameMatch || descriptionMatch || categoryMatch || brandMatch;
      });
    }

    // Normalize categories for each product to array of names
    filtered = filtered.map((product) => ({
      ...product,
      categories: Array.isArray(product.categories)
        ? product.categories
          .map((cat) => {
            // Handle different category formats
            if (typeof cat === "string") {
              return cat;
            } else if (cat && typeof cat === "object" && cat.name) {
              return cat.name;
            } else {
              return ""; // Skip invalid categories
            }
          })
          .filter((cat) => cat) // Remove empty strings
        : [],
    }));

    // Filter by subcategory if selected
    if (selectedSubCategory) {
      const subCat = categoriesData.find(
        (cat) => cat._id === selectedSubCategory
      );
      if (subCat) {
        filtered = filtered.filter((product) =>
          product.categories.includes(subCat.name)
        );
      }
    } else if (selectedCategories.length > 0) {
      // Filter by categories
      filtered = filtered.filter((product) =>
        product.categories.some((cat) => selectedCategories.includes(cat))
      );
    }

    // Filter by price range
    filtered = filtered.filter(
      (product) =>
        typeof product.price === "number" &&
        product.price >= priceRange[0] &&
        product.price <= priceRange[1]
    );

    // Filter by ratings
    if (ratings > 0) {
      filtered = filtered.filter((product) => product.ratings >= ratings);
    }

    // Filter out products that are out of stock
    filtered = filtered.filter((product) => product.stock > 0);

    setFilteredProducts(filtered);
    console.log("Products in filteredProducts:", filtered.length);
  }, [
    products,
    brand,
    keyword,
    selectedSubCategory,
    selectedCategories,
    priceRange,
    ratings,
    categoriesData,
  ]);

  // Reset page to 1 whenever any filter changes so results show from the start
  useEffect(() => {
    setCurrentPage(1);
  }, [
    brand,
    category,
    keyword,
    selectedSubCategory,
    selectedCategories,
    priceRange,
    ratings,
  ]);

  // Add useEffect for mounting
  useEffect(() => {
    setIsSliderMounted(true);
    return () => {
      setIsSliderMounted(false);
    };
  }, []);

  // Update price handler to use new min/max/step
  const priceHandler = (e, newPrice) => {
    if (isSliderMounted) {
      // Clamp values to min/max
      const clamped = [
        Math.max(priceMin, Math.min(newPrice[0], priceMax)),
        Math.max(priceMin, Math.min(newPrice[1], priceMax)),
      ];
      setPriceRange(clamped);
    }
  };

  const handleMinPriceChange = (e) => {
    const value = Number(e.target.value);
    if (value >= priceMin && value <= priceRange[1] - PRICE_STEP) {
      setPriceRange([value, priceRange[1]]);
    }
  };

  const handleMaxPriceChange = (e) => {
    const value = Number(e.target.value);
    if (value >= priceRange[0] + PRICE_STEP && value <= priceMax) {
      setPriceRange([priceRange[0], value]);
    }
  };

  const clearFilters = useCallback(() => {
    setPriceRange([priceMin, priceMax]);
    setCategory("");
    setBrand("");
    setRatings(0);
    setSelectedParentId(null);
    setSelectedSubCategory(null);
    setSelectedCategories([]);
    if (isMobile) {
      setMobileFiltersOpen(false);
    }
    // Navigate to products page to clear search
    navigate("/products");
  }, [isMobile, navigate, priceMin, priceMax]);

  // Effect to handle direct URL changes (like when user enters URL directly)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryParam = searchParams.get("category");
    const brandParam = searchParams.get("brand");

    if (categoryParam !== category) {
      setCategory(categoryParam || "");
    }

    if (brandParam !== brand) {
      setBrand(brandParam || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Handle keyword changes from URL params
  useEffect(() => {
    if (keyword && keyword !== params.keyword) {
      // Clear other filters when searching
      setCategory("");
      setBrand("");
      setSelectedParentId(null);
      setSelectedSubCategory(null);
      setSelectedCategories([]);
    }
  }, [keyword, params.keyword]);

  // Fetch products from backend with current filters
  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }

    const validKeyword = keyword || "";
    const validCategory = category || "";
    const validPrice = priceRange || [priceMin, priceMax];
    const validRatings = ratings || 0;
    const validCurrentPage = currentPage || 1;

    dispatch(
      getProducts(
        validKeyword,
        validCategory,
        validPrice,
        validRatings,
        validCurrentPage,
        false,
        brand || ""
      )
    );
  }, [
    dispatch,
    keyword,
    category,
    priceRange,
    ratings,
    currentPage,
    error,
    enqueueSnackbar,
    brand,
  ]);

  const addToCartHandler = (id, isRent) => {
    // Allow both authenticated and non-authenticated users to add items to cart
    dispatch(addItemsToCart(id, isRent));
    enqueueSnackbar("Product Added To Cart", { variant: "success" });
  };

  const goToCart = () => {
    navigate("/cart");
  };

  // Flan: no login modal or video utilities in this component

  // --- CATEGORY SECTION --- (removed for Flan)

  // --- FILTER CONTENT ---
  const [expandedParent, setExpandedParent] = useState(null);
  const handleParentToggle = (parentId) => {
    setExpandedParent(expandedParent === parentId ? null : parentId);
  };
  const handleCategoryTreeSelect = (
    parentId,
    subId = null,
    parentName = "",
    subName = ""
  ) => {
    if (subId) {
      setSelectedParentId(parentId);
      setSelectedSubCategory(subId);
      setCategory(subName);
    } else {
      setSelectedParentId(parentId);
      setSelectedSubCategory(null);
      setCategory(parentName);
    }
    setBrand("");
  };

  const FilterContent = () => (
    <div
      className="flex flex-col p-0 shadow-lg rounded-lg relative h-full"
      style={{ backgroundColor: "var(--section-bg)" }}
    >
      <div
        className="flex items-center justify-between px-4 py-3 rounded-t-lg border-b flex-shrink-0"
        style={{
          backgroundColor: "var(--primary-bg)",
          borderColor: "var(--border-light)",
        }}
      >
        <p
          className="text-lg font-bold tracking-wide"
          style={{ color: "var(--primary-blue-light)" }}
        >
          Filter
        </p>
        <button
          className="uppercase text-xs font-bold px-3 py-1 rounded transition-colors"
          style={{
            backgroundColor: "var(--brand-yellow)",
            color: "#ffffff",
            border: "1px solid var(--brand-yellow)",
          }}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = "var(--brand-yellow-dark)")
          }
          onMouseLeave={(e) =>
            (e.target.style.backgroundColor = "var(--brand-yellow)")
          }
          onClick={clearFilters}
        >
          Clear All
        </button>
      </div>
      <div
        className="flex flex-col py-4 text-sm overflow-y-auto overflow-x-hidden gap-6 flex-1 px-2 h-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 relative"
        style={{ backgroundColor: "var(--section-bg)" }}
      >
        {/* Price Range */}
        <div
          className="flex flex-col gap-3 px-3 py-3 rounded-lg"
          style={{ backgroundColor: "var(--glass-bg)" }}
        >
          <div className="flex items-center justify-between">
            <span
              className="font-bold text-base"
              style={{ color: "var(--primary-blue-light)" }}
            >
              Price Range
            </span>
            {(priceRange[0] !== priceMin || priceRange[1] !== priceMax) && (
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "var(--brand-yellow)" }}
              ></span>
            )}
          </div>
          {isSliderMounted && (
            <Box sx={{ width: "100%", px: 1 }}>
              <Slider
                value={priceRange}
                onChange={priceHandler}
                valueLabelDisplay="auto"
                min={priceMin}
                max={priceMax}
                step={PRICE_STEP}
                size="small"
                sx={{
                  color: "var(--brand-yellow)",
                  height: 4,
                  "& .MuiSlider-thumb": {
                    backgroundColor: "#ffffff",
                    border: "2px solid var(--brand-yellow)",
                  },
                  "& .MuiSlider-track": {
                    backgroundColor: "var(--brand-yellow)",
                  },
                  "& .MuiSlider-rail": {
                    backgroundColor: "var(--border-light)",
                  },
                }}
              />
            </Box>
          )}
          <div className="flex items-center gap-2 mt-2">
            <input
              type="number"
              value={priceRange[0]}
              onChange={handleMinPriceChange}
              className="w-20 px-2 py-1 text-xs rounded border focus:outline-none"
              style={{
                backgroundColor: "var(--section-bg)",
                borderColor: "var(--border-light)",
                color: "var(--text-light)",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "var(--primary-blue-dark)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "var(--border-light)")
              }
              min={priceMin}
              max={priceRange[1] - PRICE_STEP}
              step={PRICE_STEP}
              placeholder="Min"
            />
            <span style={{ color: "var(--text-dark)" }}>to</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={handleMaxPriceChange}
              className="w-20 px-2 py-1 text-xs rounded border focus:outline-none"
              style={{
                backgroundColor: "var(--section-bg)",
                borderColor: "var(--border-light)",
                color: "var(--text-light)",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "var(--primary-blue-dark)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "var(--border-light)")
              }
              min={priceRange[0] + PRICE_STEP}
              max={priceMax}
              step={PRICE_STEP}
              placeholder="Max"
            />
          </div>
        </div>
        {/* Category Tree Filter */}
        <div
          className="flex flex-col gap-3 px-3 py-3 rounded-lg"
          style={{ backgroundColor: "var(--glass-bg)" }}
        >
          <span
            className="font-bold text-base mb-2"
            style={{ color: "var(--primary-blue-light)" }}
          >
            Categories
          </span>
          <div className="flex flex-col gap-1">
            {/* All Categories Option */}
            <button
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-left border-2 ${!selectedParentId && !selectedSubCategory && category === ""
                  ? "font-bold shadow-md"
                  : "shadow-sm"
                }`}
              style={{
                backgroundColor:
                  !selectedParentId && !selectedSubCategory && category === ""
                    ? "var(--brand-yellow)"
                    : "var(--section-bg)",
                color:
                  !selectedParentId && !selectedSubCategory && category === ""
                    ? "#ffffff"
                    : "var(--text-light)",
                borderColor:
                  !selectedParentId && !selectedSubCategory && category === ""
                    ? "var(--brand-yellow)"
                    : "var(--border-light)",
              }}
              onMouseEnter={(e) => {
                if (
                  !(
                    !selectedParentId &&
                    !selectedSubCategory &&
                    category === ""
                  )
                ) {
                  e.target.style.backgroundColor = "var(--primary-bg)";
                  e.target.style.borderColor = "var(--brand-yellow)";
                }
              }}
              onMouseLeave={(e) => {
                if (
                  !(
                    !selectedParentId &&
                    !selectedSubCategory &&
                    category === ""
                  )
                ) {
                  e.target.style.backgroundColor = "var(--section-bg)";
                  e.target.style.borderColor = "var(--border-light)";
                }
              }}
              onClick={() => {
                setSelectedParentId(null);
                setSelectedSubCategory(null);
                setCategory("");
                setBrand("");
              }}
            >
              <span className="flex items-center gap-2">
                {!selectedParentId &&
                  !selectedSubCategory &&
                  category === "" && (
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: "var(--text-light)" }}
                    ></span>
                  )}
                All Categories
              </span>
            </button>
            {/* Parent Categories */}
            {categoriesData
              .filter((cat) => !cat.parent)
              .map((parent) => {
                const subcats = categoriesData.filter(
                  (cat) =>
                    cat.parent &&
                    (cat.parent._id === parent._id || cat.parent === parent._id)
                );
                const isExpanded = expandedParent === parent._id;
                const isSelectedParent =
                  selectedParentId === parent._id && !selectedSubCategory;
                return (
                  <div key={parent._id}>
                    <button
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg w-full transition-all duration-200 text-left border-2 ${isSelectedParent && category === parent.name
                          ? "font-bold shadow-md"
                          : "shadow-sm"
                        }`}
                      style={{
                        backgroundColor:
                          isSelectedParent && category === parent.name
                            ? "var(--brand-yellow)"
                            : "var(--section-bg)",
                        color:
                          isSelectedParent && category === parent.name
                            ? "#ffffff"
                            : "var(--text-light)",
                        borderColor:
                          isSelectedParent && category === parent.name
                            ? "var(--brand-yellow)"
                            : "var(--border-light)",
                      }}
                      onMouseEnter={(e) => {
                        if (!(isSelectedParent && category === parent.name)) {
                          e.target.style.backgroundColor = "var(--primary-bg)";
                          e.target.style.borderColor = "var(--brand-yellow)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!(isSelectedParent && category === parent.name)) {
                          e.target.style.backgroundColor = "var(--section-bg)";
                          e.target.style.borderColor = "var(--border-light)";
                        }
                      }}
                      onClick={() =>
                        handleCategoryTreeSelect(parent._id, null, parent.name)
                      }
                    >
                      <span className="flex items-center gap-2">
                        {isSelectedParent && category === parent.name && (
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: "#ffffff" }}
                          ></span>
                        )}
                        {parent.name}
                      </span>
                      {subcats.length > 0 && (
                        <span
                          className="ml-auto cursor-pointer p-1 rounded hover:bg-white/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleParentToggle(parent._id);
                          }}
                          title={isExpanded ? "Collapse" : "Expand"}
                        >
                          {isExpanded ? (
                            <ExpandLessIcon fontSize="small" />
                          ) : (
                            <ExpandMoreIcon fontSize="small" />
                          )}
                        </span>
                      )}
                    </button>
                    {/* Subcategories */}
                    {isExpanded && subcats.length > 0 && (
                      <div
                        className="ml-4 flex flex-col gap-1 border-l pl-2 py-1"
                        style={{ borderLeftColor: "var(--brand-yellow)" }}
                      >
                        {subcats.map((sub) => (
                          <button
                            key={sub._id}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-left border-2 shadow-sm`}
                            style={
                              selectedSubCategory === sub._id &&
                                category === sub.name
                                ? {
                                  backgroundColor: "var(--brand-yellow)",
                                  color: "#ffffff",
                                  borderColor: "var(--brand-yellow)",
                                  boxShadow:
                                    "0 6px 16px rgba(0,0,0,0.1), 0 0 0 2px rgba(255,255,255,0.2) inset",
                                }
                                : {
                                  backgroundColor: "var(--section-bg)",
                                  color: "var(--text-dark)",
                                  borderColor: "var(--border-light)",
                                }
                            }
                            onClick={() =>
                              handleCategoryTreeSelect(
                                parent._id,
                                sub._id,
                                parent.name,
                                sub.name
                              )
                            }
                          >
                            <span className="flex items-center gap-2">
                              {selectedSubCategory === sub._id &&
                                category === sub.name && (
                                  <span className="w-2 h-2 bg-white rounded-full"></span>
                                )}
                              {sub.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
        {/* Ratings */}
        <div
          className="flex flex-col gap-3 px-3 py-3 rounded-lg"
          style={{ backgroundColor: "var(--glass-bg)" }}
        >
          <span
            className="font-bold text-base mb-2"
            style={{ color: "var(--primary-blue-light)" }}
          >
            Ratings
          </span>
          <div className="flex flex-col gap-1">
            {/* All Ratings Option */}
            <button
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-left border-2 ${ratings === 0 ? "font-bold shadow-md" : "shadow-sm"
                }`}
              style={{
                backgroundColor:
                  ratings === 0 ? "var(--brand-yellow)" : "var(--section-bg)",
                color: ratings === 0 ? "#ffffff" : "var(--text-light)",
                borderColor:
                  ratings === 0 ? "var(--brand-yellow)" : "var(--border-light)",
              }}
              onMouseEnter={(e) => {
                if (ratings !== 0) {
                  e.target.style.backgroundColor = "var(--primary-bg)";
                  e.target.style.borderColor = "var(--brand-yellow)";
                }
              }}
              onMouseLeave={(e) => {
                if (ratings !== 0) {
                  e.target.style.backgroundColor = "var(--section-bg)";
                  e.target.style.borderColor = "var(--border-light)";
                }
              }}
              onClick={() => setRatings(0)}
            >
              <span className="flex items-center gap-2">
                {ratings === 0 && (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: "#ffffff" }}
                  ></span>
                )}
                All Ratings
              </span>
            </button>
            {[4, 3, 2, 1].map((el, i) => (
              <button
                key={i}
                className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-left border-2 shadow-sm"
                style={
                  ratings === el
                    ? {
                      backgroundColor: "var(--brand-yellow)",
                      color: "#ffffff",
                      borderColor: "var(--brand-yellow)",
                      boxShadow:
                        "0 6px 16px rgba(0,0,0,0.1), 0 0 0 2px rgba(255,255,255,0.2) inset",
                    }
                    : {
                      backgroundColor: "var(--section-bg)",
                      color: "var(--text-dark)",
                      borderColor: "var(--border-light)",
                    }
                }
                onClick={() => setRatings(el)}
              >
                <span className="flex items-center gap-2">
                  {ratings === el && (
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                  )}
                  <span className="flex items-center text-sm">
                    {el}
                    <StarIcon
                      sx={{
                        fontSize: "14px",
                        color:
                          ratings === el
                            ? "#ffffff"
                            : "var(--primary-blue-dark)",
                        ml: 0.5,
                      }}
                    />
                    &nbsp;and up
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
        {/* Scroll indicator gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
      </div>
    </div>
  );

  const breadcrumbItems = [
    {
      text: "Products",
      link: "/products",
    },
  ];

  if (category) {
    breadcrumbItems.push({
      text: category,
    });
  }

  if (keyword) {
    breadcrumbItems.push({
      text: `Search: "${keyword}"`,
    });
  }

  if (brand) {
    breadcrumbItems.push({
      text: `Brand: ${brand}`,
    });
  }

  const isLargeScreen = useMediaQuery("(min-width:1440px)");

  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  // Add this new function for handling page changes
  const handlePageChange = (e, val) => {
    setCurrentPage(val);
    // Scroll to top of products section
    const productsSection = document.querySelector(".products-section");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle category selection
  // Simple filter handlers removed; inline updates are used

  const handleQuickView = (product, selectedImageUrl) => {
    setQuickViewProduct(
      selectedImageUrl ? { ...product, selectedImageUrl } : product
    );
    setQuickViewOpen(true);
  };

  // Sync selectedParentId and selectedSubCategory with category and categoriesData
  useEffect(() => {
    if (category && categoriesData.length > 0) {
      const catObj = categoriesData.find((cat) => cat.name === category);
      if (catObj) {
        if (!catObj.parent) {
          setSelectedParentId(catObj._id);
          setSelectedSubCategory(null);
        } else {
          setSelectedParentId(
            typeof catObj.parent === "object"
              ? catObj.parent._id
              : catObj.parent
          );
          setSelectedSubCategory(catObj._id);
        }
      }
    } else {
      setSelectedParentId(null);
      setSelectedSubCategory(null);
    }
  }, [category, categoriesData]);

  // Removed subcategory slider effect

  return (
    <>
      <MetaData title="All Products | FlanBD" />
      <style>
        {`
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .video-container {
            position: relative;
            padding-bottom: 56.25%; /* 16:9 */
            height: 0;
            overflow: hidden;
            margin-bottom: 1rem;
          }
          .video-container iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }

          /* Flat modern filter UI overrides */
          .flat-ui * {
            box-shadow: none !important;
            border: none !important;
          }
          .flat-ui button,
          .flat-ui input,
          .flat-ui .MuiSlider-root,
          .flat-ui .MuiPaper-root,
          .flat-ui .MuiDrawer-paper {
            box-shadow: none !important;
            border: none !important;
          }
          .flat-ui .MuiSlider-track,
          .flat-ui .MuiSlider-rail,
          .flat-ui .MuiSlider-thumb {
            box-shadow: none !important;
            border: none !important;
          }
          .flat-ui .border,
          .flat-ui .border-2,
          .flat-ui .shadow,
          .flat-ui .shadow-sm,
          .flat-ui .shadow-md,
          .flat-ui .shadow-lg {
            box-shadow: none !important;
            border: none !important;
          }
          .flat-ui [style*="border:"] {
            border: none !important;
          }
          .flat-ui [style*="box-shadow:"] {
            box-shadow: none !important;
          }
          /* Ensure Drawer paper is flat */
          .MuiDrawer-paper {
            box-shadow: none !important;
            border: none !important;
          }
        `}
      </style>
      <main
        className="w-full flex flex-col items-center justify-center pt-4 min-h-screen mt-0"
        style={{ background: "var(--primary-bg)" }}
      >
        <div className="px-2 sm:px-4 w-full">
          <div className="flex justify-between mb-3 mt-8 lg:hidden">
            <Breadcrumb />
          </div>
        </div>
        {/* --- CATEGORY SECTION (Full Width) --- */}
        {/* <div className="w-full max-w-7xl mx-0 flex-1">
          <h2 className="text-4xl font-extrabold text-center text-[var(--primary-blue-dark)] mt-10 mb-4 tracking-tight drop-shadow-sm">
            Shop by Category
          </h2>
          <CategorySection />
        </div> */}
        <div className="flex flex-col md:flex-row gap-6 mt-16 px-2 sm:px-4 mb-10 w-full max-w-7xl mx-auto">
          {/* Desktop Filters */}
          {!isMobile && (
            <div
              className="hidden md:block md:w-56 flex-shrink-0 sticky top-0 self-start"
              style={{ height: "calc(100vh - 56px)", zIndex: 10 }}
            >
              <div className="h-full flex flex-col flat-ui">
                <FilterContent />
              </div>
            </div>
          )}
          {/* Mobile Filters Drawer */}
          <Drawer
            anchor="left"
            open={mobileFiltersOpen}
            onClose={() => setMobileFiltersOpen(false)}
            variant="temporary"
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              "& .MuiDrawer-paper": {
                width: { xs: "240px", sm: "280px" },
                boxSizing: "border-box",
                height: "100%",
              },
            }}
          >
            {/* Brands are not shown in mobile filter */}
            <div className="flat-ui h-full">
              <FilterContent />
            </div>
          </Drawer>
          {/* Products + Video Section Layout */}
          <div
            className={`flex-1 flex ${isLargeScreen ? "flex-row gap-6" : "flex-col"
              } w-full`}
            style={{ overflowX: "hidden" }}
          >
            {/* Products List and Categories */}
            <div className="flex-1 min-w-0">
              {/* Categories Title, Tagline, and Scrollable Row */}
              {/* <div className="mb-6">
                <div className="mb-1">
                  <h2 className="text-3xl font-semibold text-gray-800 text-left">
                    Purchase by category
                  </h2>
                </div>
                <div className="mb-2">
                  <p className="text-lg font-semibold text-blue-700 text-left">
                    From home to industry we got it all
                  </p>
                </div>
                <div className="relative">
                  <div
                    className="overflow-x-auto pb-2 border-b border-blue-100"
                    style={{
                      WebkitOverflowScrolling: "touch",
                      overflowY: "hidden",
                      scrollbarWidth: "auto",
                    }}
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>
                    <div className="flex gap-2 min-w-max pr-8">
                      <div
                        onClick={() => {
                          setCategory("");
                          setBrand("");
                          if (keyword) {
                            navigate(`/products/${keyword}`, { replace: true });
                          } else {
                            navigate("/products", { replace: true });
                          }
                        }}
                        className={`flex flex-col items-center p-4 group glass-card cursor-pointer transition-all duration-300 min-w-[120px] max-w-[140px]
                          ${
                            category === ""
                              ? "border-2 border-blue-600 ring-2 ring-blue-200 bg-blue-50"
                              : "border border-gray-200 hover:border-blue-300"
                          }
                        `}
                        style={{
                          background:
                            category === ""
                              ? "rgba(239, 246, 255, 0.8)"
                              : "white",
                        }}
                      >
                        <div
                          className={`h-14 w-14 flex items-center justify-center mb-2 rounded-full p-2 border-2 transition-colors duration-300
                          ${
                            category === ""
                              ? "border-blue-400 bg-blue-50"
                              : "border-[var(--border-light)] group-hover:border-blue-300 bg-[var(--section-bg)]/70"
                          }`}
                        >
                          <img
                            draggable="false"
                            className="h-full w-full object-contain"
                            src="/all.png"
                            alt="All Categories"
                          />
                        </div>
                        <span
                          className={`text-sm text-center font-medium truncate w-full transition-colors duration-300
                          ${
                            category === ""
                              ? "text-blue-700"
                              : "text-gray-800 group-hover:text-blue-700"
                          }`}
                        >
                          All
                        </span>
                      </div>
                      {categoriesData.map((cat) => (
                        <div
                          key={cat._id}
                          onClick={() => {
                            setCategory(cat.name);
                            setBrand("");
                            // Clear search keyword and navigate to category
                            navigate(`/products?category=${cat.name}`, {
                              replace: true,
                            });
                          }}
                          className={`flex flex-col items-center p-4 group glass-card cursor-pointer transition-all duration-300 min-w-[120px] max-w-[140px]
                            ${
                              category === cat.name
                                ? "border-2 border-blue-600 ring-2 ring-blue-200 bg-blue-50"
                                : "border border-gray-200 hover:border-blue-300"
                            }
                          `}
                          style={{
                            background:
                              category === cat.name
                                ? "rgba(239, 246, 255, 0.8)"
                                : "white",
                          }}
                        >
                          <div
                            className={`h-14 w-14 flex items-center justify-center mb-2 rounded-full p-2 border-2 transition-colors duration-300
                            ${
                              category === cat.name
                                ? "border-blue-400 bg-blue-50"
                                : "border-[var(--border-light)] group-hover:border-blue-300 bg-[var(--section-bg)]/70"
                            }`}
                          >
                            <img
                              draggable="false"
                              className="h-full w-full object-contain"
                              src={cat.icon || "/no-pictures.png"}
                              alt={cat.name}
                              onError={(e) =>
                                (e.target.src = "/no-pictures.png")
                              }
                            />
                          </div>
                          <span
                            className={`text-sm text-center font-medium truncate w-full transition-colors duration-300
                            ${
                              category === cat.name
                                ? "text-blue-700"
                                : "text-gray-800 group-hover:text-blue-700"
                            }`}
                          >
                            {cat.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div> */}

              {/* Show search result info if keyword is present and no category is selected */}
              {keyword && !category && (
                <div className="mb-4 text-base sm:text-lg text-gray-700 font-medium flex items-center gap-2 bg-white/80 rounded-lg p-3 shadow-sm border border-[var(--primary-blue-light)]">
                  <span>Showing results for "</span>
                  <span className="text-[var(--brand-yellow)] font-bold">
                    {keyword}
                  </span>
                  "
                  <span className="text-gray-500">
                    ({filteredProducts.length} products found)
                  </span>
                  <button
                    onClick={() => {
                      navigate("/products");
                    }}
                    className="ml-auto text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
                    title="Clear search"
                  >
                    <CloseIcon fontSize="small" />
                  </button>
                </div>
              )}

              {hasFetched &&
                !loading &&
                Array.isArray(products) &&
                products.length > 0 &&
                filteredProducts?.length === 0 && (
                  <div className="flex flex-col items-center justify-center gap-3 glass-card rounded-2xl bg-white/80 shadow-lg p-8 sm:p-16 border border-[var(--primary-blue-light)] mt-8">
                    <h1 className="text-2xl font-bold text-[var(--primary-blue-dark)]">
                      No results found
                    </h1>
                    <p className="text-lg text-center text-[var(--primary-blue-light)] font-medium">
                      We couldn't find any products matching your search.
                      <br />
                      Try adjusting your filters or search terms.
                    </p>
                    <div className="mt-2 flex flex-col gap-2 items-center">
                      <button
                        onClick={clearFilters}
                        className="px-6 py-2.5 bg-[var(--primary-blue-dark)] text-white rounded-full hover:bg-[var(--primary-blue-light)] hover:text-[var(--primary-blue-dark)] transition-colors duration-200 font-bold flex items-center gap-2 shadow"
                      >
                        <span>Reset Filters</span>
                      </button>
                    </div>
                  </div>
                )}

              <div className="flex flex-col gap-4">
                {/* Subcategory Tabs - modern card style, left-aligned, horizontally scrollable */}
                {/* {subCategories.length > 0 && (
                  <div className="w-full flex justify-center lg:justify-start overflow-x-auto hide-scrollbar mb-6">
                    <div
                      className="relative inline-flex bg-[#80886d89] border border-[var(--primary-blue-light)] rounded-2xl overflow-hidden max-w-min"
                      ref={tabBarRef}
                      style={{ minHeight: 70 }}
                    >
                      {subCategories.map((sub, idx) => {
                        const isFirst = idx === 0;
                        const isLast = idx === subCategories.length - 1;
                        return (
                          <div
                            key={sub._id}
                            ref={(el) => (tabRefs.current[idx] = el)}
                            onClick={() => {
                              setCategory(sub.name);
                              // Let the useEffect handle subcategory/parent id
                            }}
                            className={`relative flex items-center justify-center cursor-pointer select-none group h-[70px] w-[110px] md:h-[90px] md:w-[130px] flex-shrink-0 transition-transform duration-200
                              ${isFirst ? "rounded-l-2xl" : ""}
                              ${isLast ? "rounded-r-2xl" : ""}
                            `}
                            style={{ minWidth: 0 }}
                          >
                            <img
                              src={sub.icon || "/no-pictures.png"}
                              alt={sub.name}
                              className="absolute inset-0 w-full h-full object-cover object-center"
                              style={{ zIndex: 1 }}
                              onError={(e) =>
                                (e.target.src = "/no-pictures.png")
                              }
                            />
                            <div
                              className="absolute inset-0"
                              style={{
                                background: "rgba(95,111,82,0.18)",
                                zIndex: 2,
                              }}
                            ></div>
                            <span className="z-10 text-base md:text-lg font-extrabold text-white drop-shadow-lg text-center px-2">
                              {sub.name}
                            </span>
                          </div>
                        );
                      })}
                    
                      <div
                        className="absolute top-0 left-0 h-full pointer-events-none transition-all duration-300 rounded-2xl"
                        style={{
                          width: sliderStyle.width,
                          transform: `translateX(${sliderStyle.left}px)`,
                          background: "rgba(95,111,82,0.25)",
                          zIndex: 3,
                        }}
                      ></div>
                    </div>
                  </div>
                )} */}
                {loading ? (
                  <div className="flex flex-col gap-2 pb-4 justify-center items-center w-full overflow-hidden">
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 w-full place-content-start overflow-hidden pb-4 gap-4">
                      {[...Array(FIXED_RESULT_PER_PAGE)].map((_, idx) => (
                        <div key={idx} className="w-full">
                          <SkeletonProduct />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 pb-6 justify-center items-center w-full overflow-hidden products-section">
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 sm:w-full w-full place-content-start overflow-hidden pb-6 gap-4">
                      {filteredProducts
                        .slice(
                          (currentPage - 1) * FIXED_RESULT_PER_PAGE,
                          currentPage * FIXED_RESULT_PER_PAGE
                        )
                        .map((product) => (
                          <div key={product._id} className="w-full">
                            <ProductCard
                              product={product}
                              isProductInCart={(id) =>
                                cartItems.some((item) => item.product === id)
                              }
                              addToCartHandler={addToCartHandler}
                              goToCartHandler={goToCart}
                              handleQuickView={(prod, selectedImageUrl) =>
                                handleQuickView(product, selectedImageUrl)
                              }
                            />
                          </div>
                        ))}
                    </div>
                    {/* Only show pagination if more than one page */}
                    {filteredProducts.length > FIXED_RESULT_PER_PAGE && (
                      <Pagination
                        count={Math.ceil(
                          filteredProducts.length / FIXED_RESULT_PER_PAGE
                        )}
                        page={currentPage}
                        onChange={handlePageChange}
                        sx={{
                          "& .MuiPaginationItem-root": {
                            color: "var(--primary-blue-dark)",
                            "&.Mui-selected": {
                              backgroundColor: "var(--primary-blue-dark)",
                              color: "var(--text-light)",
                              "&:hover": {
                                backgroundColor: "var(--primary-blue-light)",
                              },
                            },
                          },
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <DealSlider title={"Best Offer"}></DealSlider>
      <HomeContactSection></HomeContactSection>
      {/* Quick View Modal */}
      <QuickViewDialog
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
        product={quickViewProduct}
        isProductInCart={(id) => cartItems.some((item) => item.product === id)}
        addToCartHandler={addToCartHandler}
        initialSelectedImageUrl={quickViewProduct?.selectedImageUrl}
      />
      {/* Mobile Filter Button - fixed at bottom */}
      <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center items-center md:hidden pointer-events-none">
        <div className="flex justify-center w-[50%] pointer-events-none">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="pointer-events-auto w-[90%] mx-auto my-3 flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[var(--primary-blue-dark)] text-white font-bold text-base shadow-lg border border-[var(--primary-blue-light)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue-light)] transition-all duration-200"
            style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.12)" }}
          >
            <FilterListIcon fontSize="medium" />
            <span>Filters</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Products;
