import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addItemsToCart } from "../../../actions/cartAction";
import Loader from "../../Layouts/Loader";
import "../SliderStyles.css";
import "../home.css";
import CategorySection from "./components/CategorySection";
import QuickViewDialog from "./components/QuickViewDialog";
import useAnimations from "./hooks/useAnimations";
import useDataFetching from "./hooks/useDataFetching";
import useScrollReveal from "../hooks/useScrollReveal";

const ProductSlider = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const titleRef = React.useRef(null);
  useScrollReveal(titleRef);

  const { loading, products } = useSelector((state) => state.products);
  const { cartItems } = useSelector((state) => state.cart);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const { isMounted } = useAnimations();
  const { categories, categoriesLoading, getProductsByCategory } =
    useDataFetching();

  const dummyCategory = {
    _id: "dummy-category-1",
    name: "All Products",
    isTopSelling: true,
  };

  const realTopSellingCategories =
    categories && categories.length > 0
      ? categories.filter(
        (cat) =>
          cat.isTopSelling && cat.name !== "Commercial Filter Water Purifiers"
      )
      : [];

  const fallbackRootCategories =
    (!realTopSellingCategories || realTopSellingCategories.length === 0) &&
      categories &&
      categories.length > 0
      ? categories.filter((cat) => !cat.parent)
      : [];

  const topSellingCategories =
    realTopSellingCategories.length > 0
      ? realTopSellingCategories
      : fallbackRootCategories.length > 0
        ? fallbackRootCategories
        : [dummyCategory];

  const addToCartHandler = (productId) => {
    if (isMounted.current) {
      dispatch(addItemsToCart(productId));
      enqueueSnackbar("Product Added To Cart", { variant: "success" });
    }
  };

  const isProductInCart = (productId) => {
    return cartItems.some((item) => item.product === productId);
  };

  const goToCartHandler = () => {
    if (isMounted.current) {
      navigate("/cart");
    }
  };

  const handleQuickView = (product, selectedImageUrl) => {
    if (isMounted.current) {
      setQuickViewProduct(
        selectedImageUrl ? { ...product, selectedImageUrl } : product
      );
      setQuickViewOpen(true);
    }
  };

  const handleCloseQuickView = () => {
    if (isMounted.current) {
      setQuickViewOpen(false);
    }
  };

  const handleSeeAll = (categoryName) => {
    if (
      categoryName === dummyCategory.name ||
      categoryName?.toLowerCase() === "all products" ||
      categoryName?.toLowerCase() === "all"
    ) {
      navigate("/products");
      return;
    }
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  const getSubcategories = (parentCategory, allCategories) => {
    if (!allCategories || !parentCategory) return [];
    return allCategories.filter(
      (cat) =>
        cat.parent &&
        (typeof cat.parent === "object" ? cat.parent._id : cat.parent) ===
        parentCategory._id
    );
  };

  const categoriesWithProducts = topSellingCategories.filter((category) => {
    const categoryProducts = getProductsByCategory(
      products,
      categories,
      category.name
    );
    if (category._id === "dummy-category-1") {
      return products && products.length > 0;
    }
    return categoryProducts && categoryProducts.length > 0;
  });

  if (categoriesWithProducts.length === 0 && products && products.length > 0) {
    categoriesWithProducts.push({
      ...dummyCategory,
      name: "All Products",
    });
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <section className="category-section">
        <div className="category-section-inner" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            No Products Available
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Please check back later or contact support if this issue persists.
          </p>
          <button onClick={() => window.location.reload()} className="btn btn-outline">
            Refresh Page
          </button>
        </div>
      </section>
    );
  }

  if (categoriesWithProducts.length === 0) {
    return (
      <section className="category-section">
        <div className="category-section-inner" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            No Categories Found
          </h3>
          <p style={{ color: 'var(--text-muted)' }}>
            Products are available but no categories match the current filter.
          </p>
        </div>
      </section>
    );
  }

  if (loading || categoriesLoading) {
    return (
      <section className="category-section">
        <div className="category-section-inner" style={{ display: 'flex', justifyContent: 'center', padding: '3rem 1.5rem' }}>
          <Loader title="Loading Products..." />
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Section Title */}
      <div className="home-section-header" ref={titleRef}>
        <span className="section-subtitle">Anime Merchandise</span>
        <h2 className="section-title">Shop by Categories</h2>
      </div>

      {/* Category Sections */}
      <div className="container">

        {categoriesWithProducts.map((category) => {
          const categoryProducts =
            category._id === "dummy-category-1"
              ? products.filter((product) => product.stock > 0)
              : getProductsByCategory(products, categories, category.name);
          const showSeeAll = categoryProducts.length > 6;
          const displayedProducts = categoryProducts.slice(0, 6);
          const subcategories = getSubcategories(category, categories);

          return (
            <CategorySection
              key={category._id}
              category={category}
              products={displayedProducts}
              isProductInCart={isProductInCart}
              addToCartHandler={addToCartHandler}
              goToCartHandler={goToCartHandler}
              handleQuickView={handleQuickView}
              showTopSellingBadge={true}
              showSeeAll={showSeeAll}
              onSeeAll={() => handleSeeAll(category.name)}
              subcategories={subcategories}
              allCategories={categories}
            />
          );
        })}
      </div>

      <QuickViewDialog
        open={quickViewOpen}
        onClose={handleCloseQuickView}
        product={quickViewProduct}
        isProductInCart={isProductInCart}
        addToCartHandler={addToCartHandler}
      />
    </>
  );
};

export default ProductSlider;
