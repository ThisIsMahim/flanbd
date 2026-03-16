import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";

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

    subcategories.forEach((subcat) => {
      grouped[subcat._id] = {
        subcategory: subcat,
        products: [],
      };
    });

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

    return Object.values(grouped)
      .filter((group) => group.products.length > 0)
      .map((group) => ({
        ...group,
        products: group.products.slice(0, 6),
      }));
  };

  const subcategoryGroups = groupProductsBySubcategory();

  const scrollToSubcategory = (subcategoryId) => {
    const element = document.getElementById(`subcategory-${subcategoryId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const ViewAllButton = ({ label, onClick, to }) => {
    const inner = (
      <>
        {label}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </>
    );

    if (onClick) {
      return (
        <button onClick={onClick} className="view-all-btn">{inner}</button>
      );
    }
    return (
      <Link to={to} className="view-all-btn">{inner}</Link>
    );
  };

  return (
    <section className="category-section">
      <div className="category-section-inner">
        {/* Category Title */}
        <h3 className="category-name">{category.name}</h3>

        {/* Subcategory Nav Pills */}
        {subcategories.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <p className="subcategory-nav-label">Subcategories</p>
            <div className="subcategory-nav">
              {subcategories.map((subcategory) => (
                <button
                  key={subcategory._id}
                  onClick={() => scrollToSubcategory(subcategory._id)}
                  className="subcategory-pill"
                  aria-label={`Navigate to ${subcategory.name} section`}
                >
                  {subcategory.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Subcategory Groups */}
        {subcategoryGroups.map((group, groupIndex) => (
          <div
            key={group.subcategory._id}
            id={`subcategory-${group.subcategory._id}`}
            style={groupIndex > 0 ? { marginTop: '3rem' } : undefined}
          >
            <h4 className="subcategory-title">{group.subcategory.name}</h4>

            <div className="product-grid">
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

            {showSeeAll && group.products.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                <ViewAllButton
                  label={`View All ${group.subcategory.name}`}
                  onClick={onSeeAll ? () => onSeeAll(group.subcategory) : undefined}
                  to={`/products?category=${category.name}&subcategory=${group.subcategory.name}`}
                />
              </div>
            )}
          </div>
        ))}

        {/* Fallback: no subcategories */}
        {subcategoryGroups.length === 0 && products.length > 0 && (
          <div className="product-grid">
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

        {/* Main View All */}
        {showSeeAll && subcategoryGroups.length === 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <ViewAllButton
              label={`View All ${category.name}`}
              onClick={onSeeAll || undefined}
              to={`/products?category=${category.name}`}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default CategorySection;
