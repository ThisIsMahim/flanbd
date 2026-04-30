import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductSlider/components/ProductCard";
import SkeletonProduct from "../Products/SkeletonProduct";
import QuickViewDialog from "./ProductSlider/components/QuickViewDialog";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { addItemsToCart } from "../../actions/cartAction";

const ProductShowcase = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { cartItems } = useSelector((state) => state.cart);

  const isProductInCart = (id) => cartItems.some((item) => item.product === id);
  const addToCartHandler = (id) => {
    dispatch(addItemsToCart(id));
    enqueueSnackbar("Product Added To Cart", { variant: "success" });
  };
  const goToCartHandler = () => {
    window.location.href = "/cart";
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const baseUrl = (process.env.REACT_APP_BACKEND_URL || "").replace(/\/$/, "");
        const response = await axios.get(`${baseUrl}/api/v1/products`);
        setProducts(response?.data?.products || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to load products");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="mx-auto max-w-[1400px] w-full overflow-hidden mb-8 px-2">
        <div className="py-6 px-0 sm:px-3 relative section-content">
          <h2 className="text-4xl font-bold mb-12 text-center" style={{ color: 'var(--primary-blue-dark)' }}>
            Featured Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(8)].map((_, i) => (
              <SkeletonProduct key={i} />
            ))}
            <div className="hidden md:block">
              <SkeletonProduct />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-[1400px] py-8 px-4 text-center" style={{ color: 'var(--primary-blue-dark)' }}>
        {error}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="mx-auto max-w-[1400px] py-8 px-4 text-center" style={{ color: 'var(--text-dark)' }}>
        No products found.
      </div>
    );
  }

  return (
    <>
      <section className="mx-auto max-w-[1400px] w-full overflow-hidden mb-8 px-2">
        <div className="py-6 px-0 sm:px-3 relative section-content">
          <h2 className="text-4xl font-bold mb-12 text-center" style={{ color: 'var(--primary-blue-dark)' }}>
            Featured Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {products.slice(0, 8).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isProductInCart={isProductInCart}
                addToCartHandler={addToCartHandler}
                goToCartHandler={goToCartHandler}
                handleQuickView={(prod, selectedImageUrl) => {
                  setQuickViewProduct(selectedImageUrl ? { ...product, selectedImageUrl } : product);
                  setIsQuickViewOpen(true);
                }}
              />
            ))}
            {products.length > 8 && (
              <div className="hidden md:block">
                <ProductCard
                  key={products[8]._id}
                  product={products[8]}
                  isProductInCart={isProductInCart}
                  addToCartHandler={addToCartHandler}
                  goToCartHandler={goToCartHandler}
                  handleQuickView={(prod, selectedImageUrl) => {
                    setQuickViewProduct(selectedImageUrl ? { ...products[8], selectedImageUrl } : products[8]);
                    setIsQuickViewOpen(true);
                  }}
                />
              </div>
            )}
          </div>
          <div className="flex justify-center mt-10">
            <button
              className="relative group overflow-hidden px-10 py-3 text-lg flex items-center gap-3 font-semibold notebook-viewall-btn"
              style={{ minWidth: 220 }}
              onClick={() => {
                navigate("/products");
              }}
            >
              <span className="relative z-10 flex items-center">
                <span className="tracking-wide drop-shadow-sm">
                  View All Products
                </span>
              </span>
              {/* Animated background shine */}
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none notebook-viewall-btn-shine"></span>
            </button>
          </div>
        </div>
      </section>
      <QuickViewDialog
        open={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        product={quickViewProduct}
        isProductInCart={isProductInCart}
        addToCartHandler={addToCartHandler}
        initialSelectedImageUrl={quickViewProduct?.selectedImageUrl}
      />
    </>
  );
};

export default ProductShowcase;
