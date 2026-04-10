import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumb = ({ product, items }) => {
  const location = useLocation();

  const separator = <span className="text-gray-300 mx-2">{">"}</span>;

  // If items are provided directly (e.g. from Products.jsx)
  if (items && items.length > 0) {
    return (
      <nav className="flex items-center flex-wrap text-[10px] sm:text-[11px] uppercase tracking-widest font-bold mb-6">
        <Link to="/" className="text-gray-400 hover:text-black transition-colors">
          Home
        </Link>
        {items.map((item, i) => (
          <React.Fragment key={i}>
            {separator}
            {item.link ? (
              <Link to={item.link} className="text-gray-400 hover:text-black transition-colors">
                {item.text}
              </Link>
            ) : (
              <span className="text-black truncate max-w-[200px]">
                {item.text}
              </span>
            )}
          </React.Fragment>
        ))}
      </nav>
    );
  }

  // Automatic breadcrumb for Product Details
  if (product) {
    const mainCategory = product.categories?.[0] || { name: product.category };

    return (
      <nav className="flex items-center flex-wrap text-[10px] sm:text-[11px] uppercase tracking-widest font-bold mb-6">
        <Link to="/" className="text-gray-400 hover:text-black transition-colors">
          Home
        </Link>

        {separator}
        <Link to="/products" className="text-gray-400 hover:text-black transition-colors">
          Shop
        </Link>

        {mainCategory?.name && (
          <>
            {separator}
            <Link
              to={`/products?category=${encodeURIComponent(mainCategory.name)}`}
              className="text-gray-400 hover:text-black transition-colors"
            >
              {mainCategory.name}
            </Link>
          </>
        )}

        {separator}
        <span className="text-black truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>
    );
  }

  // Generic fallback based on path
  const pathSegments = location.pathname.split("/").filter(Boolean);
  return (
    <nav className="flex items-center flex-wrap text-[10px] sm:text-[11px] uppercase tracking-widest font-bold mb-6">
      <Link to="/" className="text-gray-400 hover:text-black transition-colors">
        Home
      </Link>
      {pathSegments.map((segment, i) => {
        const path = `/${pathSegments.slice(0, i + 1).join("/")}`;
        const isLast = i === pathSegments.length - 1;
        const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

        // Skip 'product' segment in /product/:id
        if (segment === "product") return null;

        return (
          <React.Fragment key={path}>
            {separator}
            {isLast ? (
              <span className="text-black">{name}</span>
            ) : (
              <Link to={path} className="text-gray-400 hover:text-black transition-colors">
                {name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
