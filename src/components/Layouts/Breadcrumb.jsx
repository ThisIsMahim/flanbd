import { Link, useLocation } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeIcon from "@mui/icons-material/Home";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const Breadcrumb = ({ product }) => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  // Check if there's a category in the URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get("category");

  // Clean background style for breadcrumb
  const notebookBg = {
    background: "var(--primary-bg, #121212)",
    position: "relative",
    borderRadius: "14px",
    // Removed boxShadow and border for a cleaner look
    // boxShadow: "0 4px 16px 0 rgba(95, 111, 82, 0.08)",
    // border: "1px solid var(--primary-blue-light)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    marginTop: "1.5rem",
    marginBottom: "0.5rem",
  };

  // For product details page
  if (product) {
    // Support for category and subcategory
    let mainCategory = null;
    let subCategory = null;
    // If product.categories is an array of populated category objects
    if (Array.isArray(product.categories) && product.categories.length > 0) {
      // Find the deepest subcategory (the one with a parent)
      const subCatObj = product.categories.find(
        (cat) => cat.parent && typeof cat.parent === "object" && cat.parent.name
      );
      if (subCatObj) {
        subCategory = subCatObj;
        mainCategory = subCatObj.parent;
      } else {
        // If no subcategory, just use the first category as main
        mainCategory = product.categories[0];
      }
    } else if (product.category) {
      // Fallback for old structure
      mainCategory = { name: product.category };
    }
    return (
      <section style={notebookBg} className=" w-full px-2 sm:px-4 py-2">
        <div className="flex items-center text-sm text-gray-600">
          <Link
            to="/"
            className="hover:text-primary-blue-medium flex items-center"
          >
            <HomeIcon sx={{ fontSize: "18px" }} />
            <span className="mx-1">Home</span>
          </Link>
          <span className="mx-2 text-primary-blue-light">•</span>
          <Link to="/products" className="hover:text-primary-blue-medium mx-1">
            Products
          </Link>
          {mainCategory && (
            <>
              <span className="mx-2 text-primary-blue-light">•</span>
              <Link
                to={`/products?category=${encodeURIComponent(
                  mainCategory.name
                )}`}
                className="hover:text-primary-blue-medium mx-1"
              >
                {mainCategory.name}
              </Link>
            </>
          )}
          {subCategory && (
            <>
              <span className="mx-2 text-primary-blue-light">•</span>
              <Link
                to={`/products?category=${encodeURIComponent(
                  subCategory.name
                )}`}
                className="hover:text-primary-blue-medium mx-1"
              >
                {subCategory.name}
              </Link>
            </>
          )}
          <span className="mx-2 text-primary-blue-light">•</span>
          <span className="text-primary-blue-dark font-medium truncate max-w-xs flex items-center gap-1">
            <MenuBookIcon
              sx={{ fontSize: 18, color: "var(--primary-blue-dark)" }}
            />
            {product.name}
          </span>
        </div>
      </section>
    );
  }

  // For orders page - show "home/account/orders"
  if (
    location.pathname === "/orders" ||
    location.pathname.includes("/order/")
  ) {
    return (
      <section style={notebookBg} className="w-full px-2 sm:px-4 py-2">
        <div className="flex items-center text-sm text-gray-600">
          <Link
            to="/"
            className="hover:text-primary-blue-medium flex items-center"
          >
            <HomeIcon sx={{ fontSize: "18px" }} />
            <span className="mx-1">Home</span>
          </Link>
          <span className="mx-2 text-primary-blue-light">•</span>
          <Link to="/account" className="hover:text-primary-blue-medium mx-1">
            Account
          </Link>
          <span className="mx-2 text-primary-blue-light">•</span>
          <span className="text-primary-blue-dark font-medium mx-1 flex items-center gap-1">
            <MenuBookIcon
              sx={{ fontSize: 18, color: "var(--primary-blue-dark)" }}
            />
            Orders
          </span>
        </div>
      </section>
    );
  }

  // For products page (including with category filter)
  if (location.pathname === "/products") {
    return (
      <section style={notebookBg} className=" w-full px-2 sm:px-4 py-2">
        <div className="flex items-center text-sm text-gray-600">
          <Link
            to="/"
            className="hover:text-primary-blue-medium flex items-center"
          >
            <HomeIcon sx={{ fontSize: "18px" }} />
            <span className="mx-1">Home</span>
          </Link>
          <span className="mx-2 text-primary-blue-light">•</span>
          <Link
            to="/products"
            className={
              categoryParam
                ? "hover:text-primary-blue-medium mx-1"
                : "text-primary-blue-dark font-medium mx-1"
            }
          >
            Products
          </Link>
          {categoryParam && (
            <>
              <span className="mx-2 text-primary-blue-light">•</span>
              <span className="text-primary-blue-dark font-medium mx-1 flex items-center gap-1">
                <MenuBookIcon
                  sx={{ fontSize: 18, color: "var(--primary-blue-dark)" }}
                />
                {categoryParam}
              </span>
            </>
          )}
        </div>
      </section>
    );
  }

  // For other pages
  return (
    <section style={notebookBg} className="w-full px-2 sm:px-4 py-2">
      <div className="flex items-center text-sm text-gray-600">
        <Link
          to="/"
          className="hover:text-primary-blue-medium flex items-center"
        >
          <HomeIcon sx={{ fontSize: "18px" }} />
          <span className="mx-1">Home</span>
        </Link>
        {pathSegments.map((segment, index) => {
          if (segment === "product" && pathSegments[index + 1]) return null;
          const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const isLast = index === pathSegments.length - 1;
          const isCurrentPath = location.pathname === path;
          const displayName =
            segment.charAt(0).toUpperCase() +
            segment.slice(1).replace(/-/g, " ");
          return (
            <div key={path} className="flex items-center">
              <span className="mx-2 text-primary-blue-light">•</span>
              {isLast || isCurrentPath ? (
                <span className="text-primary-blue-dark font-medium mx-1 flex items-center gap-1">
                  <MenuBookIcon
                    sx={{ fontSize: 18, color: "var(--primary-blue-dark)" }}
                  />
                  {displayName}
                </span>
              ) : (
                <Link to={path} className="hover:text-primary-blue-medium mx-1">
                  {displayName}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Breadcrumb;
