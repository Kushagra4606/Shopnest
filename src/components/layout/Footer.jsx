import React from 'react';
import { ShoppingBag, Instagram, Twitter } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-container">
                <div className="footer-brand">
                    <div className="logo footer-logo">
                        <ShoppingBag className="logo-icon" size={24} />
                        <span>ShopNest</span>
                    </div>
                    <p className="footer-desc">
                        Elevating your everyday living with curated, quality goods designed for modern living.
                    </p>
                    <div className="social-links">
                        <a href="#" className="social-link"><Twitter size={20} /></a>
                        <a href="#" className="social-link"><Instagram size={20} /></a>
                    </div>
                </div>

                <div className="footer-links">
                    <div className="footer-column">
                        <h4>Shop</h4>
                        <ul>
                            <li><a href="#">New Arrivals</a></li>
                            <li><a href="#">Home Decor</a></li>
                            <li><a href="#">Electronics</a></li>
                            <li><a href="#">Accessories</a></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h4>Support</h4>
                        <ul>
                            <li><a href="#">Help Center</a></li>
                            <li><a href="#">Shipping & Returns</a></li>
                            <li><a href="#">Track Order</a></li>
                            <li><a href="#">Contact Us</a></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h4>Company</h4>
                        <ul>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Sustainability</a></li>
                            <li><a href="#">Press</a></li>
                            <li><a href="#">Terms & Conditions</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="footer-bottom container">
                <p>&copy; 2024 ShopNest Inc. All rights reserved.</p>
                <div className="footer-legal">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
