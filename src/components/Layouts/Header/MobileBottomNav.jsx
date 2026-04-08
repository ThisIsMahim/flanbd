import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import './MobileBottomNav.css';

const MobileBottomNav = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const location = useLocation();

  // Don't show on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="mobile-bottom-nav">
      <Link to="/" className={`bottom-nav-item ${isActive('/') ? 'active' : ''}`}>
        <HomeIcon />
        <span>Home</span>
      </Link>
      
      <Link to="/products" className={`bottom-nav-item ${isActive('/products') ? 'active' : ''}`}>
        <SearchIcon />
        <span>Shop</span>
      </Link>
      
      <Link to="/cart" className={`bottom-nav-item ${isActive('/cart') ? 'active' : ''}`}>
        <div className="cart-icon-wrapper">
          <ShoppingBagIcon />
          {cartItems.length > 0 && (
            <span className="cart-badge">{cartItems.length}</span>
          )}
        </div>
        <span>Cart</span>
      </Link>
      
      <Link to="/wishlist" className={`bottom-nav-item ${isActive('/wishlist') ? 'active' : ''}`}>
        <FavoriteBorderIcon />
        <span>Wishlist</span>
      </Link>
      
      <Link to="/account" className={`bottom-nav-item ${isActive('/account') ? 'active' : ''}`}>
        <PersonOutlineIcon />
        <span>Account</span>
      </Link>
    </div>
  );
};

export default MobileBottomNav;
