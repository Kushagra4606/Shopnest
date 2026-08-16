import React, { useEffect } from 'react';
import { X, ShoppingCart, Star, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './ProductDetailsModal.css';

const ProductDetailsModal = ({ product, onClose }) => {
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const [activeImage, setActiveImage] = useState(null);

    useEffect(() => {
        if (product) {
            setActiveImage(product.image);
        }
    }, [product]);

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

    let imageList = [];
    try {
        imageList = product.images ? JSON.parse(product.images) : [];
    } catch (e) {
        imageList = [];
    }
    if (!Array.isArray(imageList) || imageList.length === 0) {
        imageList = product.image ? [product.image] : [];
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="modal-body">
                    <div className="modal-image-container flex flex-col p-6 gap-4">
                        <div className="w-full h-80 flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden">
                            <img src={activeImage || product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
                        </div>
                        {imageList.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto w-full py-1 justify-center">
                                {imageList.map((url, index) => {
                                    const isActive = (activeImage || product.image) === url;
                                    return (
                                        <button 
                                            key={index}
                                            onClick={() => setActiveImage(url)}
                                            className={`w-12 h-12 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                                                isActive ? 'border-[#4800b2] scale-105 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <img src={url} alt={`thumb ${index}`} className="w-full h-full object-cover" />
                                        </button>
                                    );
                                })}
                            </div>
                        )}
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

                        <div className="modal-price">${product.price.toLocaleString()}</div>

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
