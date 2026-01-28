import React, { useEffect } from 'react';
import { X, ShoppingCart, Star, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './ProductDetailsModal.css';

const ProductDetailsModal = ({ product, onClose }) => {
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    if (!product) return null;

    const isWishlisted = isInWishlist(product.id);

    const toggleWishlist = () => {
        if (isWishlisted) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Prevent scrolling on body when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="modal-body">
                    <div className="modal-image-container">
                        <img src={product.image} alt={product.name} className="modal-image" />
                    </div>

                    <div className="modal-info">
                        <div className="modal-header">
                            <span className="modal-category">Lifestyle</span>
                            <h2 className="modal-title">{product.name}</h2>
                            <div className="modal-rating">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />
                                ))}
                                <span className="modal-review-count">({product.reviews} reviews)</span>
                            </div>
                        </div>

                        <div className="modal-price">₹{product.price.toLocaleString()}</div>

                        <p className="modal-description">
                            {product.description || "Experience premium quality with this exceptional product. Designed for modern living, it combines style and functionality seamlessly."}
                        </p>

                        <div className="modal-actions">
                            <button className="btn-add-cart-large" onClick={() => addToCart(product)}>
                                <ShoppingCart size={20} />
                                Add to Cart
                            </button>
                            <button
                                className={`btn-wishlist-large ${isWishlisted ? 'active' : ''}`}
                                onClick={toggleWishlist}
                            >
                                <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                            </button>
                        </div>

                        <div className="modal-extras">
                            <div className="extra-item">
                                <span className="extra-label">Availability:</span>
                                <span className="extra-value in-stock">In Stock</span>
                            </div>
                            <div className="extra-item">
                                <span className="extra-label">Delivery:</span>
                                <span className="extra-value">Free Shipping</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsModal;
