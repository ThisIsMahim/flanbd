import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MenuIcon from "@mui/icons-material/Menu";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import axios from "axios";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../../../actions/userAction";
import HistoryIcon from "@mui/icons-material/History";

// Add custom styles for navbar hover colors
if (typeof document !== "undefined") {
  const existing = document.getElementById("navbar-hover-style");
  const style = existing || document.createElement("style");
  style.id = "navbar-hover-style";
  style.innerHTML = `
    .navbar-hover-red:hover {
      color: var(--brand-yellow) !important;
    }
  `;
  if (!existing) {
    document.head.appendChild(style);
  }
}

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [accountDropdown, setAccountDropdown] = useState(false);
  const searchInputRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const accountRef = useRef(null);
  const searchModalRef = useRef(null);
  const searchInputWrapperRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const shopTimeoutRef = useRef();
  const [bannerText, setBannerText] = useState("More Than Just Merchandise !!");
  const [bannerLoading, setBannerLoading] = useState(true);

  // State for dropdown positioning
  const [shopDropdownPosition, setShopDropdownPosition] = useState("left-0");
  const [shopDropdownStyle, setShopDropdownStyle] = useState({});

  // Function to check if a menu item is active
  const isActive = (path) => location.pathname === path;

  // Function to calculate dropdown position and style
  const calculateDropdownPosition = (element) => {
    if (!element) return { position: "left-0", style: {} };

    const rect = element.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const dropdownWidth = 500;
    const margin = 40;

    // Calculate if dropdown would go off-screen
    const wouldOverflowRight =
      rect.left + dropdownWidth > viewportWidth - margin;

    let position = "left-0";
    let style = {};

    if (wouldOverflowRight) {
      position = "right-0";
      style = {
        marginRight: `${margin}px`,
        maxWidth: `calc(100vw - ${margin * 2}px)`,
      };
    } else {
      position = "left-0";
      style = {
        marginRight: `${margin}px`,
        maxWidth: `calc(100vw - ${margin * 2}px)`,
      };
    }

    return { position, style };
  };

  // Handlers for Shop dropdown
  const handleShopMouseEnter = (e) => {
    if (shopTimeoutRef.current) {
      clearTimeout(shopTimeoutRef.current);
      shopTimeoutRef.current = null;
    }
    const { position, style } = calculateDropdownPosition(e.currentTarget);
    setShopDropdownPosition(position);
    setShopDropdownStyle(style);
    setShopOpen(true);
  };
  const handleShopMouseLeave = () => {
    shopTimeoutRef.current = setTimeout(() => {
      setShopOpen(false);
    }, 100);
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (shopTimeoutRef.current) {
        clearTimeout(shopTimeoutRef.current);
      }
    };
  }, []);

  // Mobile menu toggle
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Search modal
  const openSearch = () => {
    setSearchOpen(true);
    setShowSuggestions(false);
    setTimeout(() => {
      if (searchInputRef.current) searchInputRef.current.focus();
    }, 100);
  };
  const closeSearch = () => {
    setSearchOpen(false);
    setSearchValue("");
    setSearchSuggestions([]);
    setShowSuggestions(false);
  };

  // Generate search suggestions based on categories and common terms
  const generateSearchSuggestions = (value) => {
    if (!value.trim()) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const suggestions = [];
    const lowerValue = value.toLowerCase();

    // Add category suggestions
    categories.forEach((cat) => {
      if (cat.name.toLowerCase().includes(lowerValue)) {
        suggestions.push({
          type: "category",
          text: cat.name,
          icon: "📁",
        });
      }
    });

    // Add common product suggestions
    const commonTerms = [
      "anime keychains",
      "football mufflers",
      "night lamps",
      "t-shirts",
      "collectibles",
      "merchandise",
    ];
    commonTerms.forEach((term) => {
      if (
        term.includes(lowerValue) &&
        !suggestions.some((s) => s.text === term)
      ) {
        suggestions.push({
          type: "product",
          text: term,
          icon: "📝",
        });
      }
    });

    setSearchSuggestions(suggestions.slice(0, 5));
    setShowSuggestions(suggestions.length > 0);
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    generateSearchSuggestions(value);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchValue(suggestion.text);
    setShowSuggestions(false);
    navigate(`/products/${suggestion.text}`);
    closeSearch();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/products/${searchValue}`);
    } else {
      navigate("/products");
    }
    closeSearch();
  };

  // Account dropdown actions
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
    setAccountDropdown(false);
  };

  // Scroll handler for glass effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click-away listener for account dropdown
  useEffect(() => {
    if (!accountDropdown) return;
    function handleClickOutside(event) {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [accountDropdown]);

  // Animate search modal and input with GSAP
  useEffect(() => {
    if (searchOpen && searchModalRef.current) {
      gsap.fromTo(
        searchModalRef.current,
        { opacity: 0, scale: 0.96, y: 80 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
      if (searchInputWrapperRef.current) {
        gsap.fromTo(
          searchInputWrapperRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.35, delay: 0.18, ease: "power2.out" }
        );
      }
    }
  }, [searchOpen]);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/categories`
        );
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Helper to build parent/subcategory structure from flat array
  const getCategoryTree = (categories) => {
    const parents = categories.filter((cat) => !cat.parent);
    return parents.map((parent) => ({
      ...parent,
      subcategories: categories.filter(
        (sub) => sub.parent && sub.parent._id === parent._id
      ),
    }));
  };

  useEffect(() => {
    const fetchBannerText = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/banner-text`
        );
        if (res.data.success && res.data.bannerText) {
          setBannerText(res.data.bannerText.text);
        }
      } catch (error) {
        // fallback to default
      } finally {
        setBannerLoading(false);
      }
    };
    fetchBannerText();
  }, []);

  return (
    <>
      {/* Top Banner: only visible when not scrolled */}
      {!isScrolled && (
        <div
          style={{
            background: "var(--primary-blue-dark)",
            color: "var(--text-dark)",
            borderBottom: "1px solid var(--border-light)",
          }}
          className="w-full text-center py-1 text-xs font-medium fixed top-0 left-0 z-50"
        >
          {bannerLoading ? "Loading..." : bannerText}
        </div>
      )}
      {/* Header */}
      <header
        className="w-full fixed left-0 z-40"
        style={{
          background:
            location.pathname === "/"
              ? isScrolled
                ? "var(--glass-bg)"
                : "var(--glass-bg-blurred)"
              : isScrolled
              ? "var(--glass-bg)"
              : "var(--primary-blue-dark)",
          transition:
            "background 0.3s cubic-bezier(.4,0,.2,1), min-height 0.3s cubic-bezier(.4,0,.2,1), padding 0.3s cubic-bezier(.4,0,.2,1)",
          boxShadow: isScrolled ? "0 2px 12px rgba(0,0,0,0.06)" : "none",
          borderBottom:
            location.pathname === "/" ? "" : "4px solid var(--text-light)",
          top: !isScrolled ? "24px" : "0px",
          backdropFilter: isScrolled ? "blur(8px)" : "blur(2px)",
          WebkitBackdropFilter: isScrolled ? "blur(8px)" : undefined,
        }}
      >
        <div
          className={`max-w-7xl mx-auto flex items-center justify-between px-4 ${
            isScrolled ? "py-1 min-h-[48px]" : "py-2 min-h-[56px]"
          }`}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 min-w-[140px]">
            <img
              src="/logo.png"
              alt="Flan"
              className="header-logo h-20 w-40 md:w-52 object-contain select-none"
              draggable="false"
            />
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8 relative">
            {/* Shop with dropdown */}
            <div
              className="relative"
              onMouseEnter={handleShopMouseEnter}
              onMouseLeave={handleShopMouseLeave}
            >
              <span
                className={`cursor-pointer px-2 py-1 rounded transition-colors duration-200 font-bold navbar-hover-red flex items-center gap-1 ${
                  isActive("/products") ? "underline" : ""
                }`}
                style={{ color: "white", textTransform: "uppercase" }}
                onClick={() => navigate("/products")}
              >
                shop
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    shopOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
              {shopOpen && !categoriesLoading && categories.length > 0 && (
                <div
                  className={`absolute ${shopDropdownPosition} top-full mt-2 rounded shadow-lg flex gap-12 px-12 py-8 min-w-[400px] animate-fade-in`}
                  style={{
                    zIndex: 50,
                    background: "var(--section-bg)",
                    color: "var(--brand-yellow)",
                    border: "1px solid var(--border-light)",
                    ...shopDropdownStyle,
                  }}
                >
                  {/* Render categories in columns using parent/subcategory structure */}
                  {getCategoryTree(categories).map((parent) => (
                    <div
                      key={parent._id}
                      className="flex flex-col gap-2 min-w-[120px]"
                    >
                      <Link
                        to={`/products?category=${encodeURIComponent(
                          parent.name
                        )}`}
                        className="font-bold text-base mb-1 hover:underline"
                      >
                        {parent.name}
                      </Link>
                      {parent.subcategories.length > 0 ? (
                        parent.subcategories.map((sub) => (
                          <Link
                            key={sub._id}
                            to={`/products?category=${encodeURIComponent(
                              sub.name
                            )}`}
                            className="text-sm navbar-hover-red pl-1 py-0.5 hover:underline"
                            style={{ opacity: 0.9 }}
                          >
                            {sub.name}
                          </Link>
                        ))
                      ) : (
                        <span
                          className="text-xs pl-1"
                          style={{ color: "var(--text-light)" }}
                        >
                          No subcategories
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Blogs */}
            <Link
              to="/stories"
              className={`font-bold px-2 py-1 rounded transition-colors duration-200 navbar-hover-red ${
                isActive("/stories") ? "underline" : ""
              }`}
              style={{ color: "white", textTransform: "uppercase" }}
            >
              blogs
            </Link>

            {/* About Us */}
            <Link
              to="/about"
              className={`font-bold px-2 py-1 rounded transition-colors duration-200 navbar-hover-red ${
                isActive("/about") ? "underline" : ""
              }`}
              style={{ color: "white", textTransform: "uppercase" }}
            >
              about us
            </Link>

            {/* Contact Us */}
            <Link
              to="/contact"
              className={`font-bold px-2 py-1 rounded transition-colors duration-200 navbar-hover-red ${
                isActive("/contactus") ? "underline" : ""
              }`}
              style={{ color: "white", textTransform: "uppercase" }}
            >
              contact us
            </Link>
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search Icon */}
            <button
              className="text-slate-700 hover:text-slate-900 p-1"
              onClick={openSearch}
            >
              <SearchIcon fontSize="medium" />
            </button>
            {/* Account Icon & Dropdown */}
            <div className="relative" ref={accountRef}>
              <button
                className="text-slate-700 hover:text-slate-900 p-1 relative"
                onClick={() => setAccountDropdown((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={accountDropdown}
              >
                {isAuthenticated && user?.name ? (
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-800 font-bold uppercase">
                    {user.name[0]}
                  </span>
                ) : (
                  <AccountCircleIcon fontSize="medium" />
                )}
                {isAuthenticated && user?.isGoldUser && (
                  <span className="absolute -top-1 -right-1">
                    <span className="inline-flex items-center gap-1 bg-yellow-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow">
                      <span>👑</span>
                      <span>GOLD</span>
                    </span>
                  </span>
                )}
              </button>
              {/* Dropdown */}
              {accountDropdown && (
                <div className="absolute right-0 top-10 bg-white shadow-2xl rounded flex-col text-sm z-50 min-w-[180px] animate-fade-in">
                  {!isAuthenticated ? (
                    <Link
                      to="/login"
                      className="flex px-4 py-3 text-gray-700 hover:bg-gray-100 rounded items-center gap-2"
                      onClick={() => setAccountDropdown(false)}
                    >
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ display: "inline", verticalAlign: "middle" }}
                          width="20"
                          height="20"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M15.232 5.232a2.5 2.5 0 0 1 3.536 3.536l-9.193 9.193a2 2 0 0 1-.707.464l-3.11 1.037a.5.5 0 0 1-.632-.632l1.037-3.11a2 2 0 0 1 .464-.707l9.193-9.193Zm2.122-1.415a4 4 0 0 0-5.657 0l-9.193 9.193A4 4 0 0 0 1.293 16.95l-1.037 3.11A2.5 2.5 0 0 0 4.94 22.744l3.11-1.037a4 4 0 0 0 1.414-.707l9.193-9.193a4 4 0 0 0 0-5.657Z"
                          />
                        </svg>
                      </span>
                      Login
                    </Link>
                  ) : (
                    <>
                      {user?.role === "admin" && (
                        <Link
                          className="px-4 py-3 flex gap-2 items-center hover:bg-gray-50 rounded-t text-gray-700"
                          to="/admin/dashboard"
                          onClick={() => setAccountDropdown(false)}
                        >
                          <DashboardIcon sx={{ fontSize: "18px" }} />
                          Admin Dashboard
                        </Link>
                      )}
                      <Link
                        className="px-4 py-3 flex gap-2 items-center hover:bg-gray-50 text-gray-700"
                        to="/account"
                        onClick={() => setAccountDropdown(false)}
                      >
                        <AccountCircleIcon sx={{ fontSize: "18px" }} />
                        My Profile
                      </Link>
                      <Link
                        className="px-4 py-3 flex gap-2 items-center hover:bg-gray-50 text-gray-700"
                        to="/orders"
                        onClick={() => setAccountDropdown(false)}
                      >
                        <ShoppingBagIcon sx={{ fontSize: "18px" }} />
                        Orders
                      </Link>
                      <Link
                        className="px-4 py-3 flex gap-2 items-center hover:bg-gray-50 text-gray-700"
                        to="/order-history"
                        onClick={() => setAccountDropdown(false)}
                      >
                        <HistoryIcon sx={{ fontSize: "18px" }} />
                        Order History
                      </Link>
                      <Link
                        className="px-4 py-3 flex gap-2 items-center hover:bg-gray-50 text-gray-700"
                        to="/wishlist"
                        onClick={() => setAccountDropdown(false)}
                      >
                        <FavoriteIcon sx={{ fontSize: "18px" }} />
                        Wishlist
                      </Link>
                      <div
                        className="px-4 py-3 flex gap-2 items-center hover:bg-gray-50 text-gray-700 cursor-pointer rounded-b"
                        onClick={handleLogout}
                      >
                        <PowerSettingsNewIcon sx={{ fontSize: "18px" }} />
                        Logout
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            {/* Cart Icon with badge */}
            <button
              className="text-slate-700 hover:text-slate-900 p-1 relative"
              onClick={() => navigate("/cart")}
            >
              <ShoppingCartIcon fontSize="medium" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                  {cartItems.length}
                </span>
              )}
            </button>
            {/* Hamburger for mobile */}
            <button
              className="md:hidden text-slate-700 hover:text-slate-900 p-1"
              onClick={toggleMobileMenu}
              aria-label="Open menu"
            >
              <MenuIcon fontSize="medium" />
            </button>
          </div>
        </div>
      </header>
      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50"
          style={{ background: "rgba(0,0,0,0.4)" }}
          onClick={closeMobileMenu}
        >
          <div
            className="absolute top-0 left-0 w-80 h-full flex flex-col p-6 gap-4 overflow-y-auto"
            style={{
              background: "var(--primary-blue-light)",
              color: "var(--text-light)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="self-end mb-4"
              style={{ color: "var(--text-light)" }}
              onClick={closeMobileMenu}
              aria-label="Close menu"
            >
              <span className="text-2xl">×</span>
            </button>
            <Link
              to="/"
              className="mb-6 flex items-center justify-center"
              onClick={closeMobileMenu}
            >
              <img
                src="/logo.png"
                alt="Flan"
                className="header-logo h-16 w-40 object-contain"
              />
            </Link>
            {/* Shop Menu */}
            <div className="mb-4">
              <div
                className="text-sm font-bold mb-3 uppercase tracking-wide"
                style={{ color: "var(--text-light)", opacity: 0.9 }}
              >
                SHOP
              </div>
              <Link
                to="/products"
                className="w-full text-left py-2 px-1 font-bold hover:underline flex items-center justify-between uppercase"
                style={{ color: "white" }}
                onClick={closeMobileMenu}
              >
                All Products
              </Link>
              {!categoriesLoading &&
                categories.length > 0 &&
                getCategoryTree(categories).map((parent) => (
                  <div key={parent._id} className="ml-4">
                    <Link
                      to={`/products?category=${encodeURIComponent(
                        parent.name
                      )}`}
                      className="w-full text-left py-1 px-1 text-sm font-bold hover:underline flex items-center justify-between uppercase"
                      style={{ color: "white", opacity: 0.9 }}
                      onClick={closeMobileMenu}
                    >
                      {parent.name}
                    </Link>
                    {parent.subcategories.length > 0 &&
                      parent.subcategories.map((sub) => (
                        <Link
                          key={sub._id}
                          to={`/products?category=${encodeURIComponent(
                            sub.name
                          )}`}
                          className="w-full text-left py-1 px-1 text-xs font-medium hover:underline flex items-center justify-between ml-4 uppercase"
                          style={{ color: "white", opacity: 0.8 }}
                          onClick={closeMobileMenu}
                        >
                          {sub.name}
                        </Link>
                      ))}
                  </div>
                ))}
            </div>

            {/* Navigation Items */}
            <Link
              to="/stories"
              className="py-2 px-1 font-bold hover:underline uppercase"
              style={{ color: "white" }}
              onClick={closeMobileMenu}
            >
              Blogs
            </Link>
            <Link
              to="/about"
              className="py-2 px-1 font-bold hover:underline uppercase"
              style={{ color: "white" }}
              onClick={closeMobileMenu}
            >
              About us
            </Link>
            <Link
              to="/contactus"
              className="py-2 px-1 font-bold hover:underline uppercase"
              style={{ color: "white" }}
              onClick={closeMobileMenu}
            >
              Contact us
            </Link>
            <div className="flex gap-4 mt-6">
              <button
                className="text-white hover:text-gray-200 p-1"
                onClick={openSearch}
              >
                <SearchIcon fontSize="medium" />
              </button>
              <button
                className="text-white hover:text-gray-200 p-1"
                onClick={() =>
                  navigate(isAuthenticated ? "/account" : "/login")
                }
              >
                <AccountCircleIcon fontSize="medium" />
              </button>
              <button
                className="text-white hover:text-gray-200 p-1 relative"
                onClick={() => navigate("/cart")}
              >
                <ShoppingCartIcon fontSize="medium" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                    {cartItems.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Dynamic Spacer: only visible on non-home pages */}
      {location.pathname !== "/" && (
        <div
          style={{ height: isScrolled ? "48px" : "56px" }}
          aria-hidden="true"
        />
      )}
      {/* Fullscreen Search Modal */}
      {searchOpen && (
        <div
          ref={searchModalRef}
          className="fixed inset-0 z-[999] flex items-center justify-center"
          style={{
            background: "rgba(95,111,82,0.95)", // fallback
            backgroundColor: "var(--glass-bg)",
            opacity: 0.97,
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
          }}
        >
          <button
            className="absolute top-6 right-8 text-[var(--primary-bg)]  w-12 h-12 flex items-center justify-center text-6xl hover:rotate-90 transition"
            onClick={closeSearch}
            aria-label="Close search"
            style={{ zIndex: 1001 }}
          >
            ×
          </button>
          <form
            onSubmit={handleSearchSubmit}
            className="w-full max-w-2xl flex flex-col items-center justify-center"
            style={{ zIndex: 1000 }}
          >
            <div
              ref={searchInputWrapperRef}
              className="flex flex-col w-full items-center gap-4 mb-2"
            >
              <div className="flex w-full items-center gap-4 mt-2">
                <input
                  ref={searchInputRef}
                  value={searchValue}
                  onChange={handleSearchInputChange}
                  className="w-full text-white text-4xl bg-transparent border-0 border-b-2 outline-none placeholder-white/80 px-2 py-4 transition-all duration-300"
                  style={{
                    fontWeight: 400,
                    borderColor: "var(--text-light)",
                    color: "var(--text-light)",
                  }}
                  aria-label="Type to search"
                  placeholder="Type to search"
                />
                <button
                  type="submit"
                  className="text-white text-4xl p-2 hover:text-gray-200 transition"
                  aria-label="Search"
                >
                  <ArrowForwardIcon fontSize="inherit" />
                </button>
              </div>
              {/* Search Suggestions */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div
                  className="w-full max-w-2xl rounded-lg p-2 mt-4"
                  style={{
                    background: "rgba(255,255,255,0.10)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <div className="text-white/80 text-sm mb-2 px-2">
                    Suggestions:
                  </div>
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-3 hover:bg-white/20 rounded-lg transition-colors duration-200 flex items-center gap-3"
                      style={{ color: "var(--text-light)" }}
                    >
                      <span className="text-lg">{suggestion.icon}</span>
                      <span className="text-lg">{suggestion.text}</span>
                      <span className="text-xs text-white/60 ml-auto">
                        {suggestion.type === "category"
                          ? "Category"
                          : "Product"}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Header;

