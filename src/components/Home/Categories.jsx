import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../Layouts/Loader";
import "./Home.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create refs for animations
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);

  // Personalized translation content
  const translations = {
    english: {
      title: "Explore the Collection",
      subtitle: "Find your favorite anime merchandise by category",
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
    <section className="section" ref={sectionRef}>
      <div className="home-section-header" ref={headerRef}>
        <span className="section-subtitle">{translations.english.subtitle}</span>
        <h2 className="section-title">{translations.english.title}</h2>
      </div>

      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((item, index) => {
            const catProducts = getProductsByCategory(
              products,
              item._id,
              allCategories
            );
            return (
              <Link
                to={`/products?category=${item._id}`}
                key={item._id}
                className="category-card group"
                ref={(el) => (cardsRef.current[index] = el)}
              >
                <div className="category-image-wrapper">
                  <img
                    src={item.image?.url || "/no-pictures.png"}
                    alt={item.name}
                    className="category-image group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="category-overlay group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="category-info">
                  <h3 className="category-name">{item.name}</h3>
                  <span className="category-count">
                    {catProducts.length} Products
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .category-card {
          position: relative;
          background: var(--bg-surface);
          border-radius: var(--radius-xl);
          overflow: hidden;
          transition: all var(--transition-base);
          border: 1px solid var(--border);
        }

        .category-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-xl);
          border-color: transparent;
        }

        .category-image-wrapper {
          position: relative;
          aspect-ratio: 4/5;
          overflow: hidden;
          background: var(--bg-subtle);
        }

        .category-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .category-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%);
          opacity: 0.3;
        }

        .category-info {
          padding: 1.5rem;
          text-align: center;
        }

        .category-name {
          font-family: var(--font-display);
          font-size: var(--text-lg);
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
          transition: color var(--transition-fast);
        }

        .category-card:hover .category-name {
          color: var(--accent);
        }

        .category-count {
          font-size: var(--text-xs);
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 600;
        }
      `}</style>
    </section>
  );
};

export default Categories;
