import React from "react";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const Breadcrumb = ({ product, items }) => {
  const location = useLocation();

  // If items are provided directly (e.g. from Products.jsx)
  if (items && items.length > 0) {
    return (
      <nav className="flex items-center gap-2 py-4 text-sm">
        <Link to="/" className="text-secondary hover:text-accent flex items-center gap-1 transition-colors">
          <HomeIcon sx={{ fontSize: 16 }} />
          <span>Home</span>
        </Link>
        {items.map((item, i) => (
          <React.Fragment key={i}>
            <ChevronRightIcon sx={{ fontSize: 14, color: 'var(--text-muted)' }} />
            {item.link ? (
              <Link to={item.link} className="text-secondary hover:text-accent transition-colors">
                {item.text}
              </Link>
            ) : (
              <span className="text-primary font-semibold truncate max-w-[200px]">
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
      <nav className="flex items-center gap-2 py-4 text-sm">
        <Link to="/" className="text-secondary hover:text-accent flex items-center gap-1 transition-colors">
          <HomeIcon sx={{ fontSize: 16 }} />
          <span>Home</span>
        </Link>

        <ChevronRightIcon sx={{ fontSize: 14, color: 'var(--text-muted)' }} />
        <Link to="/products" className="text-secondary hover:text-accent transition-colors">
          Shop
        </Link>

        {mainCategory?.name && (
          <>
            <ChevronRightIcon sx={{ fontSize: 14, color: 'var(--text-muted)' }} />
            <Link
              to={`/products?category=${encodeURIComponent(mainCategory.name)}`}
              className="text-secondary hover:text-accent transition-colors"
            >
              {mainCategory.name}
            </Link>
          </>
        )}

        <ChevronRightIcon sx={{ fontSize: 14, color: 'var(--text-muted)' }} />
        <span className="text-primary font-semibold truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>
    );
  }

  // Generic fallback based on path
  const pathSegments = location.pathname.split("/").filter(Boolean);
  return (
    <nav className="flex items-center gap-2 py-4 text-sm">
      <Link to="/" className="text-secondary hover:text-accent flex items-center gap-1 transition-colors">
        <HomeIcon sx={{ fontSize: 16 }} />
        <span>Home</span>
      </Link>
      {pathSegments.map((segment, i) => {
        const path = `/${pathSegments.slice(0, i + 1).join("/")}`;
        const isLast = i === pathSegments.length - 1;
        const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

        // Skip 'product' segment in /product/:id
        if (segment === "product") return null;

        return (
          <React.Fragment key={path}>
            <ChevronRightIcon sx={{ fontSize: 14, color: 'var(--text-muted)' }} />
            {isLast ? (
              <span className="text-primary font-semibold">{name}</span>
            ) : (
              <Link to={path} className="text-secondary hover:text-accent transition-colors">
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
