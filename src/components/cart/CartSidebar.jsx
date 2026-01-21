import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import PaymentModal from './PaymentModal';
import './CartSidebar.css';

const CartSidebar = ({ isOpen, onClose }) => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
    const { currentUser, signInWithGoogle } = useAuth();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const handleCheckout = async () => {
        if (!currentUser) {
            alert("Please sign in to checkout!");
            signInWithGoogle();
            return;
        }
        // Proceed to payment
        setIsCheckingOut(true);
    };

    const handleClosePayment = () => {
        setIsCheckingOut(false);
    }

    return (
        <>
            <PaymentModal isOpen={isCheckingOut} onClose={handleClosePayment} />
            <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
            <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="cart-header">
                    <h2>Your Cart <span className="item-count">({cartCount})</span></h2>
                    <button className="close-cart-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                {cartItems.length === 0 ? (
                    <div className="cart-empty-state">
                        <ShoppingBag size={48} className="empty-icon" />
                        <p>Your cart is currently empty.</p>
                        <button className="btn btn-primary" onClick={onClose}>Start Shopping</button>
                    </div>
                ) : (
                    <>
                        <div className="cart-items">
                            {cartItems.map(item => (
                                <div key={item.id} className="cart-item">
                                    <img src={item.image} alt={item.name} className="cart-item-img" />
                                    <div className="cart-item-info">
                                        <h4>{item.name}</h4>
                                        <p className="cart-item-price">₹{item.price.toLocaleString()}</p>
                                        <div className="cart-item-actions">
                                            <div className="qty-controls">
                                                <button onClick={() => updateQuantity(item.id, -1)}><Minus size={14} /></button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)}><Plus size={14} /></button>
                                            </div>
                                            <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="cart-footer">
                            <div className="cart-total">
                                <span>Subtotal</span>
                                <span>₹{cartTotal.toLocaleString()}</span>
                            </div>
                            <button className="btn btn-primary checkout-btn" onClick={handleCheckout}>
                                Checkout securely
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default CartSidebar;
