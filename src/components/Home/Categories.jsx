import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../Layouts/Loader";
import "./home.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create refs for animations
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);

      // Personalized translation content for sunglasses website
  const translations = {
    english: {
              title: "Shop Sunglasses by Category",
      subtitle:
                  "Find the perfect sunglasses for school, work, or style. Explore our curated categories!",
    },
  };

  const { products = [] } = useSelector((state) => state.products) || {};

  // Helper function to get all descendant category IDs for a parent category
  const getAllDescendantCategoryIds = (parentId, allCategories) => {
    const descendants = [parentId];
    const children = allCategories.filter(
      (cat) =>
        cat.parent &&
        (typeof cat.parent === "object" ? cat.parent._id : cat.parent) ===
          parentId
    );

    children.forEach((child) => {
      const childDescendants = getAllDescendantCategoryIds(
        child._id,
        allCategories
      );
      descendants.push(...childDescendants);
    });

    return descendants;
  };

  // Helper function to get products by category including all subcategories
  const getProductsByCategory = (products, categoryId, allCategories) => {
    if (!products || !categoryId) return [];

    // Get all descendant category IDs (including the parent)
    const allCategoryIds = getAllDescendantCategoryIds(
      categoryId,
      allCategories
    );

    return products.filter((product) => {
      if (!product.categories || !Array.isArray(product.categories))
        return false;

      // Check if product belongs to any of the descendant categories
      return product.categories.some((productCategory) => {
        const productCategoryId =
          typeof productCategory === "object"
            ? productCategory._id
            : productCategory;
        return allCategoryIds.includes(productCategoryId);
      });
    });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/categories`
        );
        if (res.data.success) {
          // Store all categories for product counting
          setAllCategories(res.data.categories);
          // Filter to show only parent categories (where parent is null)
          const parentCategories = res.data.categories.filter(
            (cat) => !cat.parent
          );
          setCategories(parentCategories);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Add CSS-based animations with Intersection Observer instead of GSAP
  useEffect(() => {
    // Add CSS styles for transitions
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      .section-fade-in {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
      }
      .section-fade-in.visible {
        opacity: 1;
        transform: translateY(0);
      }
      .header-fade-in {
        opacity: 0;
        transform: translateY(15px);
        transition: opacity 0.6s ease, transform 0.6s ease;
      }
      .header-fade-in.visible {
        opacity: 1;
        transform: translateY(0);
      }
      .card-animation {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
        transition: opacity 0.5s ease, transform 0.5s ease;
      }
      .card-animation.visible {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    `;
    document.head.appendChild(styleElement);

    // Add initial classes
    if (sectionRef.current) {
      sectionRef.current.classList.add("section-fade-in");
    }
    if (headerRef.current) {
      headerRef.current.classList.add("header-fade-in");
    }
    if (cardsRef.current.length > 0) {
      cardsRef.current.forEach((card) => {
        if (card) card.classList.add("card-animation");
      });
    }
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            if (headerRef.current) {
              setTimeout(() => {
                headerRef.current.classList.add("visible");
              }, 200);
            }
            sectionObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    const cardsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("visible");
            }, 100 * i);
            cardsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    if (sectionRef.current) {
      sectionObserver.observe(sectionRef.current);
    }
    cardsRef.current.forEach((card) => {
      if (card) cardsObserver.observe(card);
    });
    return () => {
      document.head.removeChild(styleElement);
      if (sectionRef.current) sectionObserver.unobserve(sectionRef.current);
      cardsRef.current.forEach((card) => {
        if (card) cardsObserver.unobserve(card);
      });
    };
  }, [categories]);

  if (loading) {
    return (
      <section className="block glass-container glow-border mt-6 mb-8 w-full relative overflow-hidden min-h-[300px]">
        <div className="flex justify-center items-center p-10">
          <Loader title="Loading Sunglasses Categories..." />
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="block glass-container glow-border mt-6 mb-8 w-full relative overflow-hidden min-h-[400px]"
      style={{
        background: "var(--primary-bg)",
        borderColor: "var(--border-light)",
      }}
    >
      <div className="container mx-auto relative z-10">
        <div
          ref={headerRef}
          className="text-center mb-8 section-header relative z-20"
        >
          <h2
            className="text-2xl font-bold"
            style={{ color: "var(--primary-blue-dark)" }}
          >
            {translations.english.title}
          </h2>
          <p
            className="max-w-2xl mx-auto"
            style={{ color: "var(--text-dark)" }}
          >
            {translations.english.subtitle}
          </p>
          <div
            className="h-1 w-24 mx-auto mt-3 rounded-full"
            style={{ background: "var(--primary-blue-light)" }}
          ></div>
        </div>
        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 section-content relative z-20">
          {categories.map((item, index) => {
            const productCount = getProductsByCategory(
              products,
              item._id,
              allCategories
            ).length;
            return (
              <Link
                ref={(el) => (cardsRef.current[index] = el)}
                to={`/products?category=${item.name}`}
                key={item._id}
                className="group relative rounded-xl overflow-hidden shadow-lg min-h-[320px] flex items-center justify-center transition-transform duration-300 hover:scale-[1.03]"
                style={{ minHeight: 320 }}
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${
                      item.bannerImage || item.icon || "/no-pictures.png"
                    })`,
                    filter: "brightness(0.92)",
                  }}
                ></div>
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                {/* Category Name, Product Count, and Button */}
                <div className="relative z-20 flex flex-col items-center justify-center w-full h-full text-center">
                  <span className="text-white text-2xl font-bold drop-shadow-lg mb-2 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-2xl">
                    {item.name}
                  </span>
                  {/* Product count, only visible on hover */}
                  <span className="text-white text-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-2">
                    {productCount} product{productCount !== 1 ? "s" : ""}
                  </span>
                  {/* Optional: Add a button on hover */}
                  <span className="inline-block mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="px-5 py-2 rounded-full bg-white/90 text-primary-blue-dark font-semibold shadow hover:bg-white">
                      View Products
                    </span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
