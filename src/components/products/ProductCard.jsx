import React from 'react';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './ProductCard.css';

const ProductCard = ({ product, onClick }) => {
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const isWishlisted = isInWishlist(product.id);

    const toggleWishlist = (e) => {
        e.stopPropagation();
        if (isWishlisted) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addToCart(product);
    }

    return (
        <div className="product-card" onClick={onClick}>
            <div className="product-image-wrapper">
                <span className="product-badge hot">HOT</span>
                <button
                    className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
                    onClick={toggleWishlist}
                    style={isWishlisted ? { backgroundColor: '#fee', color: '#ff4444' } : {}}
                >
                    <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
                </button>
                <img src={product.image} alt={product.name} className="product-image" />
            </div>

            <div className="product-info">
                <div className="product-rating">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className="star-icon" fill="#fbbf24" color="#fbbf24" />
                    ))}
                    <span className="review-count">({product.reviews})</span>
                </div>

                <h3 className="product-name">{product.name}</h3>
                <p className="product-desc">{product.description}</p>

                <div className="product-footer">
                    <div className="product-price">₹{product.price.toLocaleString()}</div>
                    <button
                        className="btn-add-cart"
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart size={18} /> Add
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
