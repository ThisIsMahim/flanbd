import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addItemsToCart } from "../../../actions/cartAction";
import Loader from "../../Layouts/Loader";
import "../SliderStyles.css";
import "../Home.css";
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
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl text-gray-400">📦</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#0f0f0f] uppercase tracking-tight mb-3">
            No Products Available
          </h3>
          <p className="text-gray-500 font-medium text-sm mb-8 max-w-md mx-auto">
            Please check back later or contact support if this issue persists. Our catalog is currently being updated.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3.5 bg-[#0f0f0f] hover:bg-black text-white text-[10.5px] font-extrabold uppercase tracking-[0.2em] rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-8px_rgba(0,0,0,0.5)]"
          >
            Refresh Page
          </button>
        </div>
      </section>
    );
  }

  if (categoriesWithProducts.length === 0) {
    return (
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl text-gray-400">🔍</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#0f0f0f] uppercase tracking-tight mb-3">
            No Categories Found
          </h3>
          <p className="text-gray-500 font-medium text-sm">
            Products are available but no categories match the current filter criteria.
          </p>
        </div>
      </section>
    );
  }

  if (loading || categoriesLoading) {
    return (
      <section className="py-32 bg-white flex justify-center items-center">
        <Loader title="Curating Collection..." />
      </section>
    );
  }

  return (
    <section className="bg-white py-10 md:py-14 border-t border-gray-100">
      {/* Section Title */}
      <div
        className="max-w-7xl mx-auto px-4 md:px-8 mb-10 md:mb-16 text-center"
        ref={titleRef}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-[2px] bg-[#ff1837]"></span>
            <span className="text-[10px] text-[#ff1837] font-black uppercase tracking-[0.25em]">Anime Merchandise</span>
            <span className="w-8 h-[2px] bg-[#ff1837]"></span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0f0f0f] tracking-tighter uppercase leading-[1.1] mb-8">
            Curated <span className="text-gray-400">Collections</span>
          </h2>

          {/* Global Category Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categoriesWithProducts.map(cat => (
              <button
                key={cat._id}
                onClick={() => {
                  const el = document.getElementById(`category-${cat._id}`);
                  if (el) {
                    const yOffset = -120;
                    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }}
                className="px-5 py-2.5 bg-[#f5f5f5] hover:bg-[#0f0f0f] hover:text-white text-[10px] font-black uppercase tracking-[0.15em] text-gray-500 rounded-lg transition-all duration-300"
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Sections */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {categoriesWithProducts.map((category) => {
          const categoryProducts =
            category._id === "dummy-category-1"
              ? products.filter((product) => product.stock > 0)
              : getProductsByCategory(products, categories, category.name);
          const showSeeAll = categoryProducts.length > 10;
          const displayedProducts = categoryProducts.slice(0, 10);

          return (
            <CategorySection
              key={category._id}
              category={category}
              products={displayedProducts}
              isProductInCart={isProductInCart}
              addToCartHandler={addToCartHandler}
              goToCartHandler={goToCartHandler}
              handleQuickView={handleQuickView}
              showSeeAll={showSeeAll}
              onSeeAll={() => handleSeeAll(category.name)}
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
    </section>
  );
};

export default ProductSlider;
