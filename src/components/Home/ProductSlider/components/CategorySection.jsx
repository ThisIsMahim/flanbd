import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";

// Notebook paper background and shine animation styles
const notebookStyles = `
.notebook-paper-bg {
  background: repeating-linear-gradient(
    to bottom,
    #f7f7f7 0px,
    #f7f7f7 22px,
    #e0e0e0 23px,
    #f7f7f7 24px
  );
  position: relative;
}
.notebook-shine {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  pointer-events: none;
  background: linear-gradient(35deg, rgba(255,255,255,0) 70%, rgba(255,255,255,0.85) 75%, rgba(255,255,255,0) 80%);
  animation: notebook-shine-move 20s linear infinite;
  z-index: 2;
  display:none;
}
@keyframes notebook-shine-move {
  0% { background-position: -400px 0; }
  100% { background-position: 600px 0; }
}
`;

if (
  typeof document !== "undefined" &&
  !document.getElementById("notebook-paper-style")
) {
  const style = document.createElement("style");
  style.id = "notebook-paper-style";
  style.innerHTML = notebookStyles;
  document.head.appendChild(style);
}

// Add notebook-viewall-btn and notebook-viewall-btn-shine styles
if (
  typeof document !== "undefined" &&
  !document.getElementById("notebook-viewall-btn-style")
) {
  const style = document.createElement("style");
  style.id = "notebook-viewall-btn-style";
  style.innerHTML = `
    .notebook-viewall-btn {
      background: var(--primary-blue-dark);
      color: var(--text-light);
      border: none;
      // border-radius: 0.5rem;
      box-shadow: 0 2px 8px 0 rgba(0,0,0,0.08);
      transition: background 0.3s, color 0.3s, box-shadow 0.3s;
    }
    .notebook-viewall-btn:hover {
      background: var(--primary-blue-light);
      color: var(--text-light);
      box-shadow: 0 4px 16px 0 rgba(0,0,0,0.12);
    }
    .notebook-viewall-btn-shine {
      background: linear-gradient(120deg, rgba(255,255,255,0) 60%, rgba(255,255,255,0.5) 80%, rgba(255,255,255,0) 100%);
      animation: notebook-shine-move 2.5s linear infinite;
      z-index: 2;
    }
    
    /* Subcategory navigation button styles */
    .subcategory-nav-btn {
      background: var(--primary-blue-light);
      color: var(--text-light);
      border: none;
      border-radius: 9999px;
      padding: 8px 16px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .subcategory-nav-btn:hover {
      background: var(--brand-yellow);
      color: white;
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    .subcategory-nav-btn:active {
      transform: scale(0.98);
    }
    .subcategory-nav-btn:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.3);
    }
  `;
  document.head.appendChild(style);
}

const CategorySection = ({
  category,
  products,
  isProductInCart,
  addToCartHandler,
  goToCartHandler,
  handleQuickView,
  showSeeAll,
  onSeeAll,
  subcategories = [],
  allCategories = [],
}) => {
  // Group products by subcategory
  const groupProductsBySubcategory = () => {
    const grouped = {};

    // Initialize groups for each subcategory
    subcategories.forEach((subcat) => {
      grouped[subcat._id] = {
        subcategory: subcat,
        products: [],
      };
    });

    // Add products to their respective subcategories
    products.forEach((product) => {
      const productCategories = product.categories || [];
      const matchingSubcategory = subcategories.find((subcat) => {
        return productCategories.some((cat) => {
          const catName = typeof cat === "string" ? cat : cat.name;
          return catName === subcat.name;
        });
      });

      if (matchingSubcategory) {
        grouped[matchingSubcategory._id].products.push(product);
      }
    });

    // Filter out empty groups and limit products to 6 per subcategory
    return Object.values(grouped)
      .filter((group) => group.products.length > 0)
      .map((group) => ({
        ...group,
        products: group.products.slice(0, 6),
      }));
  };

  const subcategoryGroups = groupProductsBySubcategory();

  // Function to scroll to a specific subcategory section
  const scrollToSubcategory = (subcategoryId) => {
    const element = document.getElementById(`subcategory-${subcategoryId}`);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  };

  return (
    <section className="mx-auto max-w-[1200px] glass-water-container w-full overflow-hidden mb-4 transition-all duration-300 hover:shadow-lg rounded-xl flex flex-col">
      {/* Content Area - Grid Layout */}
      <div className="py-4 px-0 relative section-content backdrop-blur-sm bg-gradient-to-br from-white/80 to-blue-50/50 rounded-xl">
        {/* Section Title */}
        <div className="mb-6 flex items-center justify-center">
          <h3
            className="text-4xl font-bold mb-2 category-title"
            style={{ color: "var(--brand-yellow)" }}
          >
            {category.name}
          </h3>
        </div>

        {/* Subcategories Display */}
        {subcategories && subcategories.length > 0 && (
          <div className="mb-6">
            <h4
              className="text-lg font-semibold mb-3 text-center"
              style={{ color: "var(--primary-blue-dark)" }}
            >
              Subcategories
            </h4>
            <div className="flex flex-wrap justify-center gap-2">
              {subcategories.map((subcategory) => (
                <button
                  key={subcategory._id}
                  onClick={() => scrollToSubcategory(subcategory._id)}
                  className="subcategory-nav-btn"
                  aria-label={`Navigate to ${subcategory.name} section`}
                >
                  {subcategory.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Render each subcategory group */}
        {subcategoryGroups.map((group, groupIndex) => (
          <div
            key={group.subcategory._id}
            id={`subcategory-${group.subcategory._id}`}
            className={groupIndex > 0 ? "mt-12" : ""}
          >
            {/* Subcategory Title */}
            <div className="mb-6 flex items-center justify-center">
              <h4
                className="text-2xl font-bold mb-2"
                style={{ color: "var(--primary-blue-dark)" }}
              >
                {group.subcategory.name}
              </h4>
            </div>

            {/* Products Grid for this subcategory */}
            <div className="grid grid-cols-2 lg:grid-cols-3 !gap-6">
              {group.products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  isProductInCart={isProductInCart}
                  addToCartHandler={addToCartHandler}
                  goToCartHandler={goToCartHandler}
                  handleQuickView={handleQuickView}
                  subcategory={group.subcategory}
                />
              ))}
            </div>

            {/* View All Button for this subcategory */}
            {showSeeAll && group.products.length > 0 && (
              <div className="flex justify-center mt-8">
                {onSeeAll ? (
                  <button
                    onClick={() => onSeeAll(group.subcategory)}
                    className="relative group overflow-hidden px-10 py-3 text-lg flex items-center gap-3 font-semibold notebook-viewall-btn"
                    style={{ minWidth: 220 }}
                  >
                    <span className="relative z-10 flex items-center">
                      View All {group.subcategory.name}
                      <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </span>
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none notebook-viewall-btn-shine"></span>
                  </button>
                ) : (
                  <Link
                    to={`/products?category=${category.name}&subcategory=${group.subcategory.name}`}
                    className="relative group overflow-hidden px-10 py-3 text-lg flex items-center gap-3 font-semibold notebook-viewall-btn"
                    style={{ minWidth: 220 }}
                  >
                    <span className="relative z-10 flex items-center">
                      View All {group.subcategory.name}
                      <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </span>
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none notebook-viewall-btn-shine"></span>
                  </Link>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Fallback: If no subcategories or no products grouped, show all products in original layout */}
        {subcategoryGroups.length === 0 && products.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-3 !gap-6">
            {products.slice(0, 6).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isProductInCart={isProductInCart}
                addToCartHandler={addToCartHandler}
                goToCartHandler={goToCartHandler}
                handleQuickView={handleQuickView}
                subcategory={null}
              />
            ))}
          </div>
        )}

        {/* Main Category View All Button (only if no subcategories or as fallback) */}
        {showSeeAll && subcategoryGroups.length === 0 && (
          <div className="flex justify-center mt-8">
            {onSeeAll ? (
              <button
                onClick={onSeeAll}
                className="relative group overflow-hidden px-10 py-3 text-lg flex items-center gap-3 font-semibold notebook-viewall-btn"
                style={{ minWidth: 220 }}
              >
                <span className="relative z-10 flex items-center">
                  View All {category.name}
                  <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </span>
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none notebook-viewall-btn-shine"></span>
              </button>
            ) : (
              <Link
                to={`/products?category=${category.name}`}
                className="relative group overflow-hidden px-10 py-3 text-lg flex items-center gap-3 font-semibold notebook-viewall-btn"
                style={{ minWidth: 220 }}
              >
                <span className="relative z-10 flex items-center">
                  View All {category.name}
                  <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </span>
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none notebook-viewall-btn-shine"></span>
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategorySection;
