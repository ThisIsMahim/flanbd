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

  // Add refs for title and subtitle (must be before any early return)
  const titleRef = React.useRef(null);
  const subtitleRef = React.useRef(null);
  useScrollReveal(titleRef);
  useScrollReveal(subtitleRef, { delay: 0.12 });

  const { loading, products } = useSelector((state) => state.products);
  const { cartItems } = useSelector((state) => state.cart);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const { isMounted } = useAnimations();
  const { categories, categoriesLoading, getProductsByCategory } =
    useDataFetching();

  // Personalized dummy category for sunglasses store
  const dummyCategory = {
    _id: "dummy-category-1",
    name: "Premium Sunglasses",
    description:
      "Discover our exclusive range of premium sunglasses—perfect for students, professionals, and creatives. Experience clear vision and elegant designs.",
    bannerImage: "/water-bg.jpg", // fallback image
    isTopSelling: true,
  };

  // Only show dummy category if there are no real top-selling categories
  const realTopSellingCategories =
    categories && categories.length > 0
      ? categories.filter(
          (cat) =>
            cat.isTopSelling && cat.name !== "Commercial Filter Water Purifiers"
        )
      : [];

  // If nothing is marked top-selling yet, fall back to top-level categories
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
    // For the dummy category, send users to the general products page
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

  // Helper function to get subcategories for a parent category
  const getSubcategories = (parentCategory, allCategories) => {
    if (!allCategories || !parentCategory) return [];
    return allCategories.filter(
      (cat) =>
        cat.parent &&
        (typeof cat.parent === "object" ? cat.parent._id : cat.parent) ===
          parentCategory._id
    );
  };

  // Only show categories that have at least one product
  const categoriesWithProducts = topSellingCategories.filter((category) => {
    const categoryProducts = getProductsByCategory(
      products,
      categories,
      category.name
    );

    // For dummy category, show it if there are any products at all
    if (category._id === "dummy-category-1") {
      return products && products.length > 0;
    }

    return categoryProducts && categoryProducts.length > 0;
  });

  // If no categories have products but we have products, show dummy category with all products
  if (categoriesWithProducts.length === 0 && products && products.length > 0) {
    categoriesWithProducts.push({
      ...dummyCategory,
      name: "All Products",
    });
  }

  // Show message if no products are available
  if (!products || products.length === 0) {
    return (
      <section className="mx-auto max-w-[1400px] w-full overflow-hidden mb-8 py-10">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Products Available
          </h3>
          <p className="text-gray-500">
            Please check back later or contact support if this issue persists.
          </p>
          <div className="mt-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Show message if no categories have products
  if (categoriesWithProducts.length === 0) {
    return (
      <section className="mx-auto max-w-[1400px] glass-container glow-border w-full overflow-hidden mb-8 py-10">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Categories with Products Found
          </h3>
          <p className="text-gray-500">
            Products are available but no categories match the current filter.
          </p>
          <div className="mt-4">
            <p className="text-sm text-gray-400">
              Available products: {products.length} | Available categories:{" "}
              {categories?.length || 0}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (loading || categoriesLoading) {
    return (
      <section className="mx-auto max-w-[1400px] glass-container glow-border w-full overflow-hidden mb-8 py-10 flex justify-center">
        <Loader title="Loading Products..." />
      </section>
    );
  }

  return (
    <>
      {/* Shop by Categories Title */}
      <section className="mx-auto max-w-[1400px] w-full mb-8">
        <div className="text-center">
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{
              color: "var(--brand-yellow)",
              textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            Shop by Categories
          </h2>
          <div
            className="w-24 h-1 mx-auto rounded-full"
            style={{ backgroundColor: "var(--brand-yellow)" }}
          ></div>
        </div>
      </section>

      <div className="mb-4">
        {categoriesWithProducts.map((category) => {
          // If this is the dummy category, show all products (filtered for stock)
          const categoryProducts =
            category._id === "dummy-category-1"
              ? products.filter((product) => product.stock > 0)
              : getProductsByCategory(products, categories, category.name);
          const showSeeAll = categoryProducts.length > 6;
          const displayedProducts = categoryProducts.slice(0, 6);

          // Get subcategories for this category
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
