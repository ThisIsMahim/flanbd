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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/categories`)
      .then(res => setCategories(res.data.categories))
      .catch(() => { });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) navigate(`/products/${searchValue}`);
    setSearchOpen(false);
    setSearchValue("");
  };

  const isActive = (path) => location.pathname === path;

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
            <Link to="/account" className="header-icon-btn">
              {isAuthenticated ? (
                <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-[10px] font-bold">
                  {user.name[0].toUpperCase()}
                </div>
              ) : (
                <PersonOutlineOutlinedIcon sx={{ fontSize: 24 }} />
              )}
            </Link>
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
