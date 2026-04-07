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
import "./Header.css";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);

  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [categories, setCategories] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) navigate(`/products/${searchValue}`);
    setSearchOpen(false);
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
          {/* Logo */}
          <Link to="/" className="header-logo">
            <img src="/logo.png" className="w-24" alt="Flan Logo" />
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
            <button className="header-icon-btn" onClick={() => setSearchOpen(true)}>
              <SearchIcon sx={{ fontSize: 22 }} />
            </button>
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
                  <PersonOutlineOutlinedIcon sx={{ fontSize: 24 }} />
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
            <Link to="/cart" className="header-icon-btn">
              <ShoppingBagOutlinedIcon sx={{ fontSize: 22 }} />
              {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
            </Link>
            <button className="header-icon-btn mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="search-modal animate-fade-in">
          <button className="search-close-btn" onClick={() => setSearchOpen(false)}>
            <CloseIcon fontSize="large" />
          </button>
          <div className="search-field-container">
            <form onSubmit={handleSearch}>
              <input
                autoFocus
                type="text"
                className="search-input"
                placeholder="Search products..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <p className="mt-4 text-secondary text-sm font-medium uppercase tracking-widest opacity-50">Press Enter to Search</p>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay animate-fade-in">
          <button className="mobile-menu-close-btn" onClick={() => setMobileMenuOpen(false)}>
            <CloseIcon fontSize="large" />
          </button>
          <Link to="/products" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
          <Link to="/stories" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Stories</Link>
          <Link to="/about" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>About</Link>
          <Link to="/contact" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
        </div>
      )}
    </>
  );
};

export default Header;
