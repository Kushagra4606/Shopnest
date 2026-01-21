import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { currentUser } = useAuth();

    // Sync with DB when user changes
    useEffect(() => {
        if (currentUser) {
            fetch('http://localhost:4242/api/cart', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })
                .then(res => res.json())
                .then(data => setCartItems(Array.isArray(data) ? data : []))
                .catch(err => console.error("Failed to load cart", err));
        } else {
            setCartItems([]);
        }
    }, [currentUser]);

    const addToCart = (product) => {
        // Optimistic Update
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true);

        if (currentUser) {
            fetch('http://localhost:4242/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ productId: product.id, quantity: 1 })
            }).catch(console.error);
        }
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));

        if (currentUser) {
            fetch(`http://localhost:4242/api/cart/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            }).catch(console.error);
        }
    };

    const updateQuantity = (id, delta) => {
        setCartItems(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);

                if (currentUser) {
                    fetch(`http://localhost:4242/api/cart/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify({ quantity: newQty })
                    }).catch(console.error);
                }

                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
