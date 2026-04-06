import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../../../utils/LanguageContext";
import "../home.css";
import "./dealslider.css";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import EditIcon from "@mui/icons-material/Edit";
import DealProductCard from "./DealProductCard";
import useScrollReveal from "../hooks/useScrollReveal";

const DealSlider = () => {
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 5;
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);

  // Translations
  const translations = {
    english: {
      title: "Hot Deals",
      subtitle: "Limited Time Offers - All products with over 20% discount!",
      noProductsTitle:
        "No products with significant discounts available at the moment.",
      noProductsSubtitle: "Check back later for exciting deals!",
      errorPrefix: "Error:",
    },
    bangla: {
      title: "হট ডিলস",
      subtitle: "সীমিত সময়ের অফার - সমস্ত পণ্য ৩০% বা তার বেশি ছাড়ে!",
      noProductsTitle: "এই মুহূর্তে উল্লেখযোগ্য ছাড়ে কোন পণ্য উপলব্ধ নেই।",
      noProductsSubtitle: "আকর্ষণীয় অফারের জন্য পরে আবার দেখুন!",
      errorPrefix: "ত্রুটি:",
    },
  };

  const t = translations[language];

  // Create refs for animations
  const titleSectionRef = useRef(null);
  const contentSectionRef = useRef(null);
  const paginationRef = useRef(null);
  const isMounted = useRef(true);

  // Add refs for title and subtitle
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  useScrollReveal(titleRef);
  useScrollReveal(subtitleRef, { delay: 0.12 });

  // Helper function to get parent category name for a product
  const getParentCategoryName = (product) => {
    if (
      !product.categories ||
      !Array.isArray(product.categories) ||
      categories.length === 0
    ) {
      return null;
    }

    // Find the first category that has a parent
    for (const productCategory of product.categories) {
      const categoryId =
        typeof productCategory === "object"
          ? productCategory._id
          : productCategory;
      const category = categories.find((cat) => cat._id === categoryId);

      if (category && category.parent) {
        // Find the parent category
        const parentCategory = categories.find(
          (cat) => cat._id === category.parent
        );
        if (parentCategory) {
          return parentCategory.name;
        }
      }
    }

    // If no subcategory found, return the first category name
    const firstCategory = product.categories[0];
    if (firstCategory) {
      const categoryId =
        typeof firstCategory === "object" ? firstCategory._id : firstCategory;
      const category = categories.find((cat) => cat._id === categoryId);
      return category ? category.name : null;
    }

    return null;
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/categories`
        );
        if (response.data.success) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products and filter those with >30% discount
  useEffect(() => {
    isMounted.current = true;

    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/v1/products"); // Replace with your actual API endpoint

        // Filter products with >30% discount, valid images, and in stock
        const productsWithHighDiscount = response.data.products.filter(
          (product) => {
            if (
              product.price &&
              product.cuttedPrice &&
              product.images?.length > 0 &&
              product.stock > 0 // Only show products that are in stock
            ) {
              const discountPercentage =
                ((product.cuttedPrice - product.price) / product.cuttedPrice) *
                100;
              return discountPercentage >= 20;
            }
            return false;
          }
        );

        if (isMounted.current) {
          setDiscountedProducts(productsWithHighDiscount);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted.current) {
          setError(err.message);
          setLoading(false);
        }
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();

    return () => {
      isMounted.current = false;
    };
  }, []);

  // Handle product click
  const handleProductClick = (productId, selectedImageUrl) => {
    navigate(`/product/${productId}`, selectedImageUrl ? { state: { selectedImageUrl } } : undefined);
  };

  // Pagination handlers
  const goToNextPage = () => {
    setCurrentPage((prev) =>
      Math.min(
        prev + 1,
        Math.ceil(discountedProducts.length / productsPerPage) - 1
      )
    );
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  // Going to a specific page
  const goToPage = (pageNumber) => {
    if (pageNumber >= 0 && pageNumber < totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Calculate total pages and current products to display
  const totalPages = Math.ceil(discountedProducts.length / productsPerPage);
  const startIndex = currentPage * productsPerPage;
  const endIndex = Math.min(
    startIndex + productsPerPage,
    discountedProducts.length
  );
  const currentProducts = discountedProducts.slice(startIndex, endIndex);

  // Set up Intersection Observer for animations
  useEffect(() => {
    // Set up Intersection Observer for animations
    if (discountedProducts.length > 0 && isMounted.current) {
      // Set initial classes
      if (titleSectionRef.current) {
        titleSectionRef.current.classList.add("deal-title-section");
        const decoration =
          titleSectionRef.current.querySelector(".title-decoration");
        if (decoration) {
          decoration.classList.add("title-decoration");
        }
      }

      if (contentSectionRef.current) {
        contentSectionRef.current.classList.add("deal-content-section");
      }

      // Create observers
      const titleObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && isMounted.current) {
              entry.target.classList.add("visible");

              // Add delay for decoration animation
              const decoration =
                entry.target.querySelector(".title-decoration");
              if (decoration) {
                setTimeout(() => {
                  if (isMounted.current) {
                    decoration.classList.add("visible");
                  }
                }, 300);
              }

              titleObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );

      const contentObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && isMounted.current) {
              entry.target.classList.add("visible");
              contentObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      // Start observing
      if (titleSectionRef.current) {
        titleObserver.observe(titleSectionRef.current);
      }

      if (contentSectionRef.current) {
        contentObserver.observe(contentSectionRef.current);
      }

      // Cleanup function
      return () => {
        if (titleSectionRef.current) {
          titleObserver.unobserve(titleSectionRef.current);
        }

        if (contentSectionRef.current) {
          contentObserver.unobserve(contentSectionRef.current);
        }
      };
    }
  }, [discountedProducts]);

  // Generate pagination numbers
  const getPaginationNumbers = () => {
    const pageNumbers = [];

    // Show first page, current page, and last page with ellipses
    if (totalPages <= 5) {
      // If few pages, show all
      for (let i = 0; i < totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(0);

      // Show ellipsis if current page is not close to first page
      if (currentPage > 2) {
        pageNumbers.push(-1); // -1 represents ellipsis
      }

      // Pages around current page
      for (
        let i = Math.max(1, currentPage - 1);
        i <= Math.min(totalPages - 2, currentPage + 1);
        i++
      ) {
        pageNumbers.push(i);
      }

      // Show ellipsis if current page is not close to last page
      if (currentPage < totalPages - 3) {
        pageNumbers.push(-2); // -2 represents ellipsis
      }

      // Always include last page
      pageNumbers.push(totalPages - 1);
    }

    return pageNumbers;
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-[1400px] py-8 px-4">
        <div className="flex flex-col space-y-4">
          <Skeleton height={30} width={200} />
          <Skeleton height={20} width={300} />
          <div className="grid grid-cols-2 sm:grid-cols-3  gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-2">
                <Skeleton height={160} />
                <Skeleton height={16} className="mt-2" />
                <Skeleton height={16} width={100} className="mt-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-[1400px] py-8 px-4 text-center text-red-500">
        {t.errorPrefix} {error}
      </div>
    );
  }

  if (discountedProducts.length === 0) {
    return (
      <div className="mx-auto max-w-[1400px] py-8 px-4 text-center">
        <h3 className="text-xl font-semibold text-gray-700">
          {t.noProductsTitle}
        </h3>
        <p className="text-gray-500 mt-2">{t.noProductsSubtitle}</p>
      </div>
    );
  }

  return (
    <section className="deal-slider-section" ref={contentSectionRef}>
      <div className="home-section-header px-4 sm:px-6 lg:px-8" ref={titleSectionRef}>
        <span className="section-subtitle">Flash Sale</span>
        <h2 className="section-title">{t.title}</h2>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {currentProducts.map((product) => (
            <DealProductCard
              key={product._id}
              product={product}
              categoryName={getParentCategoryName(product)}
              onClick={() => handleProductClick(product._id, product.images?.[0]?.url)}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pagination-container" ref={paginationRef}>
            <button
              className="pagination-control"
              onClick={goToPrevPage}
              disabled={currentPage === 0}
              aria-label="Previous page"
            >
              <ChevronLeftIcon />
            </button>

            <div className="pagination-dots">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  className={`pagination-dot ${currentPage === idx ? "active" : ""}`}
                  onClick={() => goToPage(idx)}
                  aria-label={`Go to page ${idx + 1}`}
                />
              ))}
            </div>

            <button
              className="pagination-control"
              onClick={goToNextPage}
              disabled={currentPage === totalPages - 1}
              aria-label="Next page"
            >
              <ChevronRightIcon />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default DealSlider;

