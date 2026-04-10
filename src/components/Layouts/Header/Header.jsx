import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../../../actions/userAction";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CartDrawer from '../../Cart/CartDrawer';
import "./Header.css";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.user || {});
  const { cartItems = [] } = useSelector((state) => state.cart || {});
  const { wishlistItems = [] } = useSelector((state) => state.wishlist || {});

  const [isScrolled, setIsScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [categories, setCategories] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All categories");
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const categoryRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/categories`)
      .then(res => setCategories(res.data.categories))
      .catch(() => { });

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAccountDropdownOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setCategoryMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setCategoryMenuOpen(false);
    setMobileMenuOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      const categoryPath = selectedCategory !== "All categories" ? `?category=${selectedCategory}` : "";
      navigate(`/products/${searchValue}${categoryPath}`);
    }
    setSearchValue("");
  };

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    dispatch(logoutUser());
    setAccountDropdownOpen(false);
    navigate("/login");
  };

  const closeDropdown = () => setAccountDropdownOpen(false);

  return (
    <>
      <header className={`header-wrapper ${isScrolled ? 'scrolled' : ''} ${location.pathname === '/' ? 'home-page' : ''}`}>
        <div className="header-container">
          <button className="header-icon-btn mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
            <MenuIcon />
          </button>

          {/* Logo */}
          <Link to="/" className="header-logo">
            <img src="/logo.png" className="w-16" alt="Flan Logo" />
          </Link>

          {/* Nav */}
          <nav className="nav-links">
            <Link to="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`}>Shop</Link>
            <Link to="/stories" className={`nav-link ${isActive('/stories') ? 'active' : ''}`}>Stories</Link>
            <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>About</Link>
            <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact</Link>
          </nav>


          {/* Actions */}
          <div className="header-actions">
            <div className="account-dropdown-container" ref={dropdownRef}>
              <button
                className="header-icon-btn profile-trigger"
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
              >
                {isAuthenticated ? (
                  <div className="profile-avatar-circle">
                    {user.name && user.name[0].toUpperCase()}
                  </div>
                ) : (
                  <PersonOutlineOutlinedIcon sx={{ fontSize: 20 }} />
                )}
              </button>

              {accountDropdownOpen && (
                <div className="account-dropdown-menu animate-scale-in">
                  {isAuthenticated ? (
                    <>
                      <div className="account-dropdown-header">
                        <p className="user-greeting">Hi, {user.name.split(' ')[0]}</p>
                        <p className="user-email">{user.email}</p>
                      </div>
                      <div className="account-dropdown-divider" />
                      <Link to="/orders" className="account-dropdown-item" onClick={closeDropdown}>
                        <ShoppingBagIcon sx={{ fontSize: 18 }} />
                        <span>My Orders</span>
                      </Link>
                      <Link to="/account" className="account-dropdown-item" onClick={closeDropdown}>
                        <ManageAccountsIcon sx={{ fontSize: 18 }} />
                        <span>Profile Settings</span>
                      </Link>
                      <Link to="/wishlist" className="account-dropdown-item" onClick={closeDropdown}>
                        <FavoriteBorderIcon sx={{ fontSize: 18 }} />
                        <span>My Wishlist</span>
                      </Link>
                      {user.role === "admin" && (
                        <Link to="/admin/dashboard" className="account-dropdown-item" onClick={closeDropdown}>
                          <DashboardIcon sx={{ fontSize: 18 }} />
                          <span>Admin Panel</span>
                        </Link>
                      )}
                      <div className="account-dropdown-divider" />
                      <button className="account-dropdown-item logout-btn" onClick={handleLogout}>
                        <LogoutIcon sx={{ fontSize: 18 }} />
                        <span>Log Out</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="account-dropdown-header">
                        <p className="user-greeting">Welcome back</p>
                        <p className="user-email">Sign in to your account</p>
                      </div>
                      <div className="account-dropdown-divider" />
                      <Link to="/login" className="account-dropdown-item primary" onClick={closeDropdown}>
                        <LoginIcon sx={{ fontSize: 18 }} />
                        <span>Log In</span>
                      </Link>
                      <Link to="/register" className="account-dropdown-item" onClick={closeDropdown}>
                        <AppRegistrationIcon sx={{ fontSize: 18 }} />
                        <span>Create Account</span>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
            <Link to="/wishlist" className="header-icon-btn wishlist-icon-desktop relative" aria-label="Wishlist">
              <FavoriteBorderIcon sx={{ fontSize: 20 }} />
              {wishlistItems?.length > 0 && <span className="cart-badge bg-[#FF1837]">{wishlistItems.length}</span>}
            </Link>
            <button className="header-icon-btn cart-icon-desktop relative" onClick={() => setCartDrawerOpen(true)} aria-label="Open cart">
              <ShoppingBagOutlinedIcon sx={{ fontSize: 20 }} />
              {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
            </button>
          </div>
        </div>

        {/* Search Bar Row (Permanent) */}
        <div className="header-search-row">
          <div className="header-search-container">
            <div className="search-bar-inner">
              <div className="search-category-select" ref={categoryRef}>
                <button
                  type="button"
                  className="category-trigger"
                  onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
                >
                  <span>{selectedCategory}</span>
                  <span className={`chevron ${categoryMenuOpen ? 'up' : ''}`}>▼</span>
                </button>

                {categoryMenuOpen && (
                  <div className="category-dropdown animate-scale-in">
                    <div
                      className="category-item"
                      onClick={() => { setSelectedCategory("All categories"); setCategoryMenuOpen(false); }}
                    >
                      All categories
                    </div>
                    {categories.filter(cat => !cat.parent).map((cat) => (
                      <div
                        key={cat._id}
                        className="category-item"
                        onClick={() => { setSelectedCategory(cat.name); setCategoryMenuOpen(false); }}
                      >
                        {cat.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="search-divider" />

              <form className="search-form" onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Type here..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <button type="submit" className="search-submit-btn">
                  <SearchIcon sx={{ fontSize: 16 }} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div className={`mobile-menu-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <button className="mobile-menu-close-btn" onClick={() => setMobileMenuOpen(false)}>
            <CloseIcon fontSize="medium" />
          </button>
        </div>
        <div className="mobile-menu-content">
          <div className={`mobile-nav-item-group ${mobileShopOpen ? 'active' : ''}`}>
            <button
              className="mobile-nav-link shop-toggle"
              onClick={() => setMobileShopOpen(!mobileShopOpen)}
            >
              Shop
              <span className={`dropdown-arrow ${mobileShopOpen ? 'open' : ''}`}>▼</span>
            </button>
            <div className={`mobile-shop-categories ${mobileShopOpen ? 'open' : ''}`}>
              <Link to="/products" className="mobile-category-link" onClick={() => setMobileMenuOpen(false)}>
                All Products
              </Link>
              {categories && categories.filter(cat => !cat.parent).map((cat) => (
                <Link
                  key={cat._id}
                  to={`/products/${cat.name}`}
                  className="mobile-category-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
          <Link to="/stories" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            Stories
          </Link>
          <Link to="/about" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            About
          </Link>
          <Link to="/contact" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            Contact
          </Link>
          <Link to="/wishlist" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            Wishlist
          </Link>
          <Link to="/orders" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            Track Order
          </Link>
          <Link to="/login" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            Sign In
          </Link>
          <Link to="/register" className="mobile-register-btn" onClick={() => setMobileMenuOpen(false)}>
            Register
          </Link>
        </div>
        <div className="mobile-menu-footer">
          <div className="mobile-social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FacebookIcon sx={{ fontSize: 20 }} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <InstagramIcon sx={{ fontSize: 20 }} />
            </a>
            <a href="https://wa.me/123456789" target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon sx={{ fontSize: 20 }} />
            </a>
          </div>
        </div>
      </div>
      {mobileMenuOpen && <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)} />}

      {/* Cart Drawer */}
      <CartDrawer open={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
    </>
  );
};

export default Header;
