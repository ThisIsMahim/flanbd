import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PersonIcon from '@mui/icons-material/Person';
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
        <div className="bottom-nav-icon-wrapper">
          {isActive('/') ? <HomeIcon /> : <HomeOutlinedIcon />}
        </div>
        <span>Home</span>
      </Link>

      <Link to="/products" className={`bottom-nav-item ${isActive('/products') ? 'active' : ''}`}>
        <div className="bottom-nav-icon-wrapper">
          <SearchIcon />
        </div>
        <span>Shop</span>
      </Link>



      <Link to="/wishlist" className={`bottom-nav-item ${isActive('/wishlist') ? 'active' : ''}`}>
        <div className="bottom-nav-icon-wrapper">
          {isActive('/wishlist') ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </div>
        <span>Wishlist</span>
      </Link>

      <Link to="/account" className={`bottom-nav-item ${isActive('/account') ? 'active' : ''}`}>
        <div className="bottom-nav-icon-wrapper">
          {isActive('/account') ? <PersonIcon /> : <PersonOutlineIcon />}
        </div>
        <span>Account</span>
      </Link>
    </div>
  );
};

export default MobileBottomNav;
