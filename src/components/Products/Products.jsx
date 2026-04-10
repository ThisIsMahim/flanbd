import CloseIcon from "@mui/icons-material/Close";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterListIcon from "@mui/icons-material/FilterList";
import GridViewIcon from "@mui/icons-material/GridView";
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
import DealSlider from "../Home/DealSlider/DealSlider";
// import HomeContactSection from "../Home/HomeContactSection";
import ProductCard from "../Home/ProductSlider/components/ProductCard";
import QuickViewDialog from "../Home/ProductSlider/components/QuickViewDialog";
import Breadcrumb from "../Layouts/Breadcrumb";
import MetaData from "../Layouts/MetaData";
import SkeletonProduct from "./SkeletonProduct";
import "./Products.css";
import "../Home/SliderStyles.css"; // Card styles

const PRICE_STEP = 10;
const FIXED_RESULT_PER_PAGE = 9;

const Products = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector((state) => state.products);
  const { cartItems } = useSelector((state) => state.cart);
  const { keyword, categoryName, subCategoryName } = useParams();
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
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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

  useEffect(() => {
    const fetchPriceRange = async () => {
      try {
        const baseUrl = (process.env.REACT_APP_BACKEND_URL || "").replace(/\/$/, "");
        const res = await fetch(`${baseUrl}/api/v1/products/price-range`);
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
  }, [loading, category, brand, keyword, priceRange, currentPage]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const baseUrl = (process.env.REACT_APP_BACKEND_URL || "").replace(/\/$/, "");
        const response = await fetch(`${baseUrl}/api/v1/categories`);
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
      // Specific sub-category selected: match that sub-category only
      const subCat = categoriesData.find(c => c._id === selectedSubCategory);
      if (subCat) {
        const subCatName = subCat.name.toLowerCase();
        filtered = filtered.filter(p => p.categories?.some(c => (typeof c === 'string' ? c : c.name).toLowerCase() === subCatName));
      }
    } else if (selectedParentId) {
      // Parent category selected: match products in ANY sub-category of this parent, or the parent itself
      const allChildNames = categoriesData
        .filter(c => c.parent && (c.parent._id === selectedParentId || c.parent === selectedParentId))
        .map(c => c.name.toLowerCase());
      const parentCat = categoriesData.find(c => c._id === selectedParentId);
      if (parentCat) allChildNames.push(parentCat.name.toLowerCase());

      if (allChildNames.length > 0) {
        filtered = filtered.filter(p => p.categories?.some(c => allChildNames.includes((typeof c === 'string' ? c : c.name).toLowerCase())));
      }
    } else if (selectedCategories.length > 0) {
      const lowerSelected = selectedCategories.map(c => c.toLowerCase());
      filtered = filtered.filter(p => p.categories?.some(c => lowerSelected.includes((typeof c === 'string' ? c : c.name).toLowerCase())));
    } else if (category) {
      const lowerCat = category.toLowerCase();
      filtered = filtered.filter(p => p.categories?.some(c => (typeof c === 'string' ? c : c.name).toLowerCase() === lowerCat));
    }

    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    filtered = filtered.filter(p => p.stock > 0);

    setFilteredProducts(filtered);
  }, [products, brand, keyword, selectedSubCategory, selectedCategories, priceRange, categoriesData, category]);

  useEffect(() => { setCurrentPage(1); }, [brand, category, keyword, selectedSubCategory, selectedCategories, priceRange]);

  useEffect(() => {
    setIsSliderMounted(true);
    return () => setIsSliderMounted(false);
  }, []);

  const [localPriceRange, setLocalPriceRange] = useState(priceRange);

  useEffect(() => {
    setLocalPriceRange(priceRange);
  }, [priceRange]);

  const priceHandler = (e, newPrice) => {
    if (isSliderMounted) {
      setLocalPriceRange(newPrice);
    }
  };

  const handlePriceCommitted = (e, newPrice) => {
    setPriceRange([Math.max(priceMin, newPrice[0]), Math.min(priceMax, newPrice[1])]);
  };

  const handleMinPriceChange = (e) => {
    const val = e.target.value === "" ? 0 : Number(e.target.value);
    setLocalPriceRange([val, localPriceRange[1]]);
  };

  const handleMaxPriceChange = (e) => {
    const val = e.target.value === "" ? priceMax : Number(e.target.value);
    setLocalPriceRange([localPriceRange[0], val]);
  };

  const handlePriceInputBlur = () => {
    let min = Math.max(priceMin, Math.min(localPriceRange[0], priceMax));
    let max = Math.max(priceMin, Math.min(localPriceRange[1], priceMax));

    if (min > max) {
      const temp = min;
      min = max;
      max = temp;
    }

    setLocalPriceRange([min, max]);
    setPriceRange([min, max]);
  };

  const clearFilters = useCallback(() => {
    setCategory("");
    setBrand("");
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

    // Only update category from query param if it exists, 
    // to avoid clearing path-based category state
    if (catParam && catParam !== category) {
      setCategory(catParam);
    }
    if (brandParam !== brand) {
      setBrand(brandParam || "");
    }
  }, [location.search, category, brand]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    dispatch(getProducts(keyword, category, priceRange, 0, currentPage, brand));
  }, [dispatch, keyword, category, priceRange, currentPage, error, enqueueSnackbar, brand]);

  const addToCartHandler = (id) => {
    dispatch(addItemsToCart(id, 1));
    enqueueSnackbar("Product Added To Cart", { variant: "success" });
  };

  const goToCart = () => navigate("/cart");

  const handleParentToggle = (parentId) => {
    setExpandedParent(expandedParent === parentId ? null : parentId);
  };

  const handleCategoryTreeSelect = (parentId, subId = null, parentName = "", subName = "") => {
    if (subId) {
      navigate(`/product-category/${encodeURIComponent(parentName)}/${encodeURIComponent(subName)}`);
    } else {
      navigate(`/product-category/${encodeURIComponent(parentName)}`);
    }
    setBrand("");
  };

  useEffect(() => {
    if (categoriesData.length === 0) return;

    if (subCategoryName) {
      const decodedCat = decodeURIComponent(categoryName).toLowerCase();
      const decodedSub = decodeURIComponent(subCategoryName).toLowerCase();

      const parentCat = categoriesData.find(c => c.name.toLowerCase() === decodedCat);
      const subCat = categoriesData.find(c => c.name.toLowerCase() === decodedSub);

      if (parentCat && subCat) {
        setSelectedParentId(parentCat._id);
        setSelectedSubCategory(subCat._id);
        setCategory(subCat.name);
      }
    } else if (categoryName) {
      const decodedCat = decodeURIComponent(categoryName).toLowerCase();
      const cat = categoriesData.find(c => c.name.toLowerCase() === decodedCat);
      if (cat) {
        setSelectedParentId(cat._id);
        setSelectedSubCategory(null);
        setCategory(cat.name);
      }
    } else if (!keyword && !brand) {
      setSelectedParentId(null);
      setSelectedSubCategory(null);
      setCategory("");
    }
  }, [categoryName, subCategoryName, categoriesData]);

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

  const buildBreadcrumbs = () => {
    const items = [{ text: "Shop", link: "/products" }];

    if (selectedSubCategory) {
      const subCat = categoriesData.find(c => c._id === selectedSubCategory);
      if (subCat) {
        const pId = typeof subCat.parent === 'object' ? subCat.parent._id : subCat.parent;
        const parentCat = categoriesData.find(c => c._id === (pId || selectedParentId));
        if (parentCat) {
          items.push({
            text: parentCat.name,
            link: `/product-category/${encodeURIComponent(parentCat.name)}`
          });
        }
        items.push({ text: subCat.name });
      }
    } else if (category && selectedParentId) {
      items.push({ text: category });
    } else if (category) {
      items.push({ text: category });
    } else {
      items.push({ text: "All Products" });
    }

    if (keyword) items.push({ text: `Search: "${keyword}"` });
    if (brand) items.push({ text: `Brand: ${brand}` });

    return items;
  };

  const breadcrumbItems = buildBreadcrumbs();

  const sidebarContent = (
    <div className="filter-card">
      <div className="filter-header">
        <h2 className="filter-title">Filter By</h2>
      </div>

      <div className="filter-body">
        {/* Categories */}
        <div className="filter-section">
          {/* <span className="filter-group-title">Categories</span> */}
          <div className="filter-category-list">
            <button
              className={`filter-category-item ${!selectedParentId && !selectedSubCategory && category === "" ? "active" : ""}`}
              onClick={() => { setSelectedParentId(null); setSelectedSubCategory(null); setCategory(""); }}
            >
              <span className="flex items-center gap-3">
                <GridViewIcon sx={{ fontSize: "1.1rem" }} />
                All Products
              </span>
            </button>
            {categoriesData.filter(c => !c.parent).map(parent => {
              const subcats = categoriesData.filter(c => c.parent && (c.parent._id === parent._id || c.parent === parent._id));
              const isExpanded = expandedParent === parent._id;
              const isSelected = selectedParentId === parent._id && !selectedSubCategory;
              return (
                <div key={parent._id} className="category-group">
                  <button
                    className={`filter-category-item ${isSelected ? "active" : ""}`}
                    onClick={() => handleCategoryTreeSelect(parent._id, null, parent.name)}
                  >
                    <span className="flex items-center gap-3">
                      <div className="category-dot" />
                      {parent.name}
                    </span>
                    {subcats.length > 0 && (
                      <span className="expand-icon-wrap" onClick={(e) => { e.stopPropagation(); handleParentToggle(parent._id); }}>
                        {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                      </span>
                    )}
                  </button>
                  {isExpanded && subcats.length > 0 && (
                    <div className="filter-subcategory-list">
                      {subcats.map(sub => (
                        <button
                          key={sub._id}
                          className={`filter-category-item sub-item ${selectedSubCategory === sub._id ? "active" : ""}`}
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

        {/* Price Range */}
        <div className="filter-section">
          <span className="filter-group-title">Price Range</span>
          <Box sx={{ px: 2, mt: 1 }}>
            <Slider
              value={localPriceRange}
              onChange={priceHandler}
              onChangeCommitted={handlePriceCommitted}
              valueLabelDisplay="off"
              min={priceMin}
              max={priceMax}
              step={PRICE_STEP}
              size="small"
              sx={{
                color: "#FF1837",
                height: 2,
                '& .MuiSlider-thumb': {
                  backgroundColor: "#FF1837",
                  width: 10,
                  height: 10,
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: '0px 0px 0px 8px rgba(255, 24, 55, 0.16)',
                  },
                },
                '& .MuiSlider-track': {
                  backgroundColor: "#FF1837",
                  height: 2,
                },
                '& .MuiSlider-rail': {
                  backgroundColor: "#E2E2E2",
                  opacity: 1,
                  height: 2,
                },
              }}
            />
          </Box>
          <div className="price-range-labels">
            <span>৳{localPriceRange[0]}</span>
            <span>৳{localPriceRange[1]}+</span>
          </div>
        </div>

        <div className="filter-footer">
          <button className="reset-filters-btn" onClick={clearFilters}>Reset Filters</button>
        </div>
      </div>
    </div>
  );



  return (
    <>
      <MetaData title="All Products | FlanBD" />
      <main className="bg-[var(--bg-primary)] mt-24">
        <div className="products-hero-section">
          <Breadcrumb items={breadcrumbItems.slice(0, -1)} />
          <h1 className="products-hero-title">
            {breadcrumbItems[breadcrumbItems.length - 1].text}
          </h1>
        </div>
        <div className="products-page-container">
          {/* Desktop Sidebar */}
          {!isMobile && (
            <aside className="filter-sidebar">
              {sidebarContent}
            </aside>
          )}

          {/* Mobile Filters Drawer */}
          <Drawer
            anchor="left"
            open={mobileFiltersOpen}
            onClose={() => setMobileFiltersOpen(false)}
            sx={{ "& .MuiDrawer-paper": { width: 280 } }}
          >
            {sidebarContent}
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
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-4 sm:gap-y-10">
                {[...Array(12)].map((_, i) => <SkeletonProduct key={i} />)}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-12">
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
              </>
            )}
          </div>
        </div>
      </main >

      <DealSlider title="Best Offers" />

      <QuickViewDialog
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
        product={quickViewProduct}
        isProductInCart={(id) => cartItems.some(i => i.product === id)}
        addToCartHandler={addToCartHandler}
      />

      {/* Floating Mobile Filter Trigger */}
      {
        isMobile && (
          <button className="mobile-filter-trigger" onClick={() => setMobileFiltersOpen(true)}>
            <FilterListIcon />
            <span>Filters</span>
          </button>
        )
      }
    </>
  );
};

export default Products;
