import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, User, LogOut, Heart, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import './Header.css';

const Header = ({ onOpenCart, cartCount = 0 }) => {
    const { currentUser, logout, isAdmin } = useAuth();
    const { wishlistItems, setIsWishlistOpen } = useWishlist();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="header">
            <div className="container header-container">
                <Link to="/" className="logo" onClick={closeMobileMenu}>
                    <ShoppingBag className="logo-icon" size={28} />
                    <span className="logo-text">ShopNest</span>
                </Link>

                <nav className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                    <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={closeMobileMenu}>Home</Link>
                    <Link to="/shop" className={`nav-link ${location.pathname === '/shop' ? 'active' : ''}`} onClick={closeMobileMenu}>Shop</Link>
                    <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`} onClick={closeMobileMenu}>Stories</Link>
                    <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`} onClick={closeMobileMenu}>Contact</Link>
                    {isAdmin && (
                        <Link to="/admin" className={`nav-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`} onClick={closeMobileMenu}>Admin</Link>
                    )}
                </nav>

                <div className="header-actions">
                    <button className="wishlist-btn" onClick={() => setIsWishlistOpen(true)}>
                        <Heart size={24} />
                        {wishlistItems.length > 0 && <span className="cart-badge">{wishlistItems.length}</span>}
                    </button>

                    {currentUser ? (
                        <div className="user-menu-container">
                            <button
                                className="user-btn"
                                onClick={() => setShowUserMenu(!showUserMenu)}
                            >
                                <User size={20} className="user-avatar" />
                                <span className="user-name">{currentUser.name.split(' ')[0]}</span>
                            </button>

                            {showUserMenu && (
                                <div className="user-dropdown">
                                    <div className="dropdown-item" onClick={() => { logout(); closeMobileMenu(); }}>
                                        <LogOut size={16} /> Logout
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="btn-signin" onClick={closeMobileMenu}>
                            Sign In
                        </Link>
                    )}

                    <button className="cart-btn" onClick={onOpenCart}>
                        <span className="cart-label">Cart</span>
                        <span className="cart-badge">{cartCount}</span>
                    </button>
                    <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
