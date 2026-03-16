import CloseIcon from "@mui/icons-material/Close";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterListIcon from "@mui/icons-material/FilterList";
import StarIcon from "@mui/icons-material/Star";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Pagination from "@mui/material/Pagination";
import Slider from "@mui/material/Slider";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { addItemsToCart } from "../../actions/cartAction";
import { clearErrors, getProducts } from "../../actions/productAction";
import DealSlider from "../home/DealSlider/DealSlider";
import HomeContactSection from "../home/HomeContactSection";
import ProductCard from "../home/ProductSlider/components/ProductCard";
import QuickViewDialog from "../home/ProductSlider/components/QuickViewDialog";
import Breadcrumb from "../Layouts/Breadcrumb";
import MetaData from "../Layouts/MetaData";
import SkeletonProduct from "./SkeletonProduct";
import "./Products.css";
import "../home/SliderStyles.css"; // Card styles

const PRICE_STEP = 100;
const FIXED_RESULT_PER_PAGE = 9;

const Products = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [isSliderMounted, setIsSliderMounted] = useState(false);
  const [category, setCategory] = useState(
    location.search ? new URLSearchParams(location.search).get("category") || "" : ""
  );
  const [brand, setBrand] = useState(
    location.search ? new URLSearchParams(location.search).get("brand") || "" : ""
  );
  const [ratings, setRatings] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { products, loading, error } = useSelector((state) => state.products);
  const { cartItems } = useSelector((state) => state.cart);
  const keyword = params.keyword || "";

  const [categoriesData, setCategoriesData] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(200000);
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [expandedParent, setExpandedParent] = useState(null);

  // Fetch price range
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
      } catch (e) { }
    };
    fetchPriceRange();
  }, []);

  useEffect(() => {
    if (!loading) setHasFetched(true);
    else setHasFetched(false);
  }, [loading, category, brand, keyword, priceRange, ratings, currentPage]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/categories`);
        const data = await response.json();
        if (data.success) setCategoriesData(data.categories);
      } catch (error) {
        setCategoriesData([]);
      }
    };
    fetchCategories();
  }, []);

  const [filteredProducts, setFilteredProducts] = useState([]);

  // Filtering logic
  useEffect(() => {
    if (!Array.isArray(products)) {
      setFilteredProducts([]);
      return;
    }

    let filtered = [...products];

    if (brand) {
      filtered = filtered.filter((product) => product.brand?.name === brand);
    }

    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      filtered = filtered.filter((p) => {
        const nameMatch = p.name?.toLowerCase().includes(lowerKeyword);
        const descMatch = p.description?.toLowerCase().includes(lowerKeyword);
        const catMatch = p.categories?.some(c => (typeof c === 'string' ? c : c.name)?.toLowerCase().includes(lowerKeyword));
        const brandMatch = p.brand?.name?.toLowerCase().includes(lowerKeyword);
        return nameMatch || descMatch || catMatch || brandMatch;
      });
    }

    // Normalized filter
    if (selectedSubCategory) {
      const subCat = categoriesData.find(c => c._id === selectedSubCategory);
      if (subCat) {
        filtered = filtered.filter(p => p.categories?.some(c => (typeof c === 'string' ? c : c.name) === subCat.name));
      }
    } else if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => p.categories?.some(c => selectedCategories.includes(typeof c === 'string' ? c : c.name)));
    } else if (category) {
      filtered = filtered.filter(p => p.categories?.some(c => (typeof c === 'string' ? c : c.name) === category));
    }

    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (ratings > 0) filtered = filtered.filter(p => p.ratings >= ratings);
    filtered = filtered.filter(p => p.stock > 0);

    setFilteredProducts(filtered);
  }, [products, brand, keyword, selectedSubCategory, selectedCategories, priceRange, ratings, categoriesData, category]);

  useEffect(() => { setCurrentPage(1); }, [brand, category, keyword, selectedSubCategory, selectedCategories, priceRange, ratings]);

  useEffect(() => {
    setIsSliderMounted(true);
    return () => setIsSliderMounted(false);
  }, []);

  const priceHandler = (e, newPrice) => {
    if (isSliderMounted) {
      setPriceRange([Math.max(priceMin, newPrice[0]), Math.min(priceMax, newPrice[1])]);
    }
  };

  const handleMinPriceChange = (e) => {
    const val = Number(e.target.value);
    if (val >= priceMin && val <= priceRange[1] - PRICE_STEP) {
      setPriceRange([val, priceRange[1]]);
    }
  };

  const handleMaxPriceChange = (e) => {
    const val = Number(e.target.value);
    if (val >= priceRange[0] + PRICE_STEP && val <= priceMax) {
      setPriceRange([priceRange[0], val]);
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
    if (isMobile) setMobileFiltersOpen(false);
    navigate("/products");
  }, [isMobile, navigate, priceMin, priceMax]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const catParam = searchParams.get("category");
    const brandParam = searchParams.get("brand");
    if (catParam !== category) setCategory(catParam || "");
    if (brandParam !== brand) setBrand(brandParam || "");
  }, [location.search, category, brand]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    dispatch(getProducts(keyword, category, priceRange, ratings, currentPage, false, brand));
  }, [dispatch, keyword, category, priceRange, ratings, currentPage, error, enqueueSnackbar, brand]);

  const addToCartHandler = (id, isRent) => {
    dispatch(addItemsToCart(id, isRent));
    enqueueSnackbar("Product Added To Cart", { variant: "success" });
  };

  const goToCart = () => navigate("/cart");

  const handleParentToggle = (parentId) => {
    setExpandedParent(expandedParent === parentId ? null : parentId);
  };

  const handleCategoryTreeSelect = (parentId, subId = null, parentName = "", subName = "") => {
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

  const handlePageChange = (e, val) => {
    setCurrentPage(val);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleQuickView = (product, selectedImageUrl) => {
    setQuickViewProduct(selectedImageUrl ? { ...product, selectedImageUrl } : product);
    setQuickViewOpen(true);
  };

  useEffect(() => {
    if (category && categoriesData.length > 0) {
      const catObj = categoriesData.find(c => c.name === category);
      if (catObj) {
        if (!catObj.parent) {
          setSelectedParentId(catObj._id);
          setSelectedSubCategory(null);
        } else {
          setSelectedParentId(typeof catObj.parent === "object" ? catObj.parent._id : catObj.parent);
          setSelectedSubCategory(catObj._id);
        }
      }
    }
  }, [category, categoriesData]);

  const FilterContent = () => (
    <div className="filter-card">
      <div className="filter-header">
        <h2 className="filter-title">Filters</h2>
        <button className="filter-clear-btn" onClick={clearFilters}>Clear All</button>
      </div>
      <div className="filter-body">
        {/* Price Range */}
        <div className="filter-section">
          <span className="filter-group-title">Price Range</span>
          <Box sx={{ px: 1 }}>
            <Slider
              value={priceRange}
              onChange={priceHandler}
              valueLabelDisplay="auto"
              min={priceMin}
              max={priceMax}
              step={PRICE_STEP}
              size="small"
              sx={{
                color: "var(--accent)",
                "& .MuiSlider-thumb": { backgroundColor: "#fff", border: "2px solid var(--accent)" },
                "& .MuiSlider-track": { backgroundColor: "var(--accent)" },
                "& .MuiSlider-rail": { backgroundColor: "var(--border-subtle)" },
              }}
            />
          </Box>
          <div className="price-input-row">
            <input type="number" value={priceRange[0]} onChange={handleMinPriceChange} className="price-field" placeholder="Min" />
            <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>to</span>
            <input type="number" value={priceRange[1]} onChange={handleMaxPriceChange} className="price-field" placeholder="Max" />
          </div>
        </div>

        {/* Categories */}
        <div className="filter-section">
          <span className="filter-group-title">Categories</span>
          <div className="filter-category-list">
            <button
              className={`filter-category-item ${!selectedParentId && !selectedSubCategory && category === "" ? "active" : ""}`}
              onClick={() => { setSelectedParentId(null); setSelectedSubCategory(null); setCategory(""); }}
            >
              All Categories
            </button>
            {categoriesData.filter(c => !c.parent).map(parent => {
              const subcats = categoriesData.filter(c => c.parent && (c.parent._id === parent._id || c.parent === parent._id));
              const isExpanded = expandedParent === parent._id;
              const isSelected = selectedParentId === parent._id && !selectedSubCategory;
              return (
                <div key={parent._id}>
                  <button
                    className={`filter-category-item ${isSelected ? "active" : ""}`}
                    onClick={() => handleCategoryTreeSelect(parent._id, null, parent.name)}
                  >
                    {parent.name}
                    {subcats.length > 0 && (
                      <span onClick={(e) => { e.stopPropagation(); handleParentToggle(parent._id); }}>
                        {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                      </span>
                    )}
                  </button>
                  {isExpanded && subcats.length > 0 && (
                    <div className="filter-subcategory-list">
                      {subcats.map(sub => (
                        <button
                          key={sub._id}
                          className={`filter-category-item ${selectedSubCategory === sub._id ? "active" : ""}`}
                          onClick={() => handleCategoryTreeSelect(parent._id, sub._id, parent.name, sub.name)}
                        >
                          {sub.name}
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
        <div className="filter-section">
          <span className="filter-group-title">Ratings</span>
          <div className="filter-category-list">
            <button className={`filter-rating-btn ${ratings === 0 ? "active" : ""}`} onClick={() => setRatings(0)}>
              All Ratings
            </button>
            {[4, 3, 2, 1].map(el => (
              <button key={el} className={`filter-rating-btn ${ratings === el ? "active" : ""}`} onClick={() => setRatings(el)}>
                <span className="flex items-center gap-1">
                  {el} <StarIcon sx={{ fontSize: "14px", color: ratings === el ? "white" : "var(--accent)" }} /> and up
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const breadcrumbItems = [{ text: "Products", link: "/products" }];
  if (category) breadcrumbItems.push({ text: category });
  if (keyword) breadcrumbItems.push({ text: `Search: "${keyword}"` });
  if (brand) breadcrumbItems.push({ text: `Brand: ${brand}` });

  return (
    <>
      <MetaData title="All Products | FlanBD" />
      <main className="bg-[var(--bg-primary)]">
        <div className="mx-auto max-w-[1400px] border-b border-[var(--border-subtle)] px-4 py-2">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <div className="products-page-container">
          {/* Desktop Sidebar */}
          {!isMobile && (
            <aside className="filter-sidebar">
              <FilterContent />
            </aside>
          )}

          {/* Mobile Filters Drawer */}
          <Drawer
            anchor="left"
            open={mobileFiltersOpen}
            onClose={() => setMobileFiltersOpen(false)}
            sx={{ "& .MuiDrawer-paper": { width: 280 } }}
          >
            <FilterContent />
          </Drawer>

          {/* Product Grid */}
          <div className="flex-1">
            {keyword && !category && (
              <div className="search-header">
                <span>Showing results for <span className="search-keyword">"{keyword}"</span></span>
                <span className="search-count">({filteredProducts.length} products found)</span>
                <button onClick={() => navigate("/products")} className="ml-auto opacity-50 hover:opacity-100">
                  <CloseIcon fontSize="small" />
                </button>
              </div>
            )}

            {hasFetched && !loading && products.length > 0 && filteredProducts.length === 0 && (
              <div className="empty-products-state">
                <h2 className="empty-state-title">No results found</h2>
                <p className="text-secondary text-center">We couldn't find any products matching your filters.</p>
                <button onClick={clearFilters} className="view-all-btn">Reset Filters</button>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => <SkeletonProduct key={i} />)}
              </div>
            ) : (
              <div className="products-grid-section">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts
                    .slice((currentPage - 1) * FIXED_RESULT_PER_PAGE, currentPage * FIXED_RESULT_PER_PAGE)
                    .map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        isProductInCart={(id) => cartItems.some(i => i.product === id)}
                        addToCartHandler={addToCartHandler}
                        goToCartHandler={goToCart}
                        handleQuickView={handleQuickView}
                      />
                    ))}
                </div>

                {filteredProducts.length > FIXED_RESULT_PER_PAGE && (
                  <div className="pagination-container">
                    <Pagination
                      count={Math.ceil(filteredProducts.length / FIXED_RESULT_PER_PAGE)}
                      page={currentPage}
                      onChange={handlePageChange}
                      sx={{
                        "& .MuiPaginationItem-root": {
                          fontFamily: 'var(--font-display)',
                          fontWeight: 600,
                          "&.Mui-selected": { backgroundColor: "var(--text-primary)", color: "#fff", "&:hover": { backgroundColor: "var(--accent)" } },
                        },
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <DealSlider title="Best Offers" />
      <HomeContactSection />

      <QuickViewDialog
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
        product={quickViewProduct}
        isProductInCart={(id) => cartItems.some(i => i.product === id)}
        addToCartHandler={addToCartHandler}
      />

      {/* Floating Mobile Filter Trigger */}
      {isMobile && (
        <button className="mobile-filter-trigger" onClick={() => setMobileFiltersOpen(true)}>
          <FilterListIcon />
          <span>Filters</span>
        </button>
      )}
    </>
  );
};

export default Products;
