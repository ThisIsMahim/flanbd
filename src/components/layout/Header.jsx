import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, User } from 'lucide-react';
import { scrollToElement } from '../../hooks/useLenis';
import './Header.css';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (e, href) => {
        if (href.startsWith('#')) {
            e.preventDefault();
            scrollToElement(href, { offset: -80 });
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container">
                <nav className="nav">
                    {/* Logo */}
                    <Link to="/" className="logo">
                        Flan
                    </Link>

                    {/* Desktop Navigation */}
                    <ul className="nav-links desktop-only">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/products">Shop</Link></li>
                        <li><a href="#collections" onClick={(e) => handleNavClick(e, '#collections')}>Collections</a></li>
                        <li><a href="#about" onClick={(e) => handleNavClick(e, '#about')}>About</a></li>
                        <li><a href="#contact" onClick={(e) => handleNavClick(e, '#contact')}>Contact</a></li>
                    </ul>

                    {/* Actions */}
                    <div className="nav-actions">
                        <button className="icon-btn" aria-label="Search">
                            <Search size={20} />
                        </button>
                        <Link to="/account" className="icon-btn" aria-label="Account">
                            <User size={20} />
                        </Link>
                        <Link to="/cart" className="icon-btn cart-btn" aria-label="Shopping Cart">
                            <ShoppingCart size={20} />
                            <span className="cart-badge">0</span>
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="icon-btn mobile-menu-toggle"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </nav>

                {/* Mobile Navigation */}
                <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
                    <ul className="mobile-nav-links">
                        <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link></li>
                        <li><Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link></li>
                        <li><a href="#collections" onClick={(e) => handleNavClick(e, '#collections')}>Collections</a></li>
                        <li><a href="#about" onClick={(e) => handleNavClick(e, '#about')}>About</a></li>
                        <li><a href="#contact" onClick={(e) => handleNavClick(e, '#contact')}>Contact</a></li>
                    </ul>
                </div>
            </div>
        </header>
    );
};

export default Header;
