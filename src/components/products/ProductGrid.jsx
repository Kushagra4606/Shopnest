import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import './ProductGrid.css';

const ProductGrid = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/products')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch products');
                return res.json();
            })
            .then(data => {
                // Map the image paths relative to public folder if needed, 
                // but since they are /assets/..., they should work if server is static or frontend is 5173.
                // Note: Frontend is on 5173, Backend on 4242.
                // Images are in public/assets. Vite serves public/ at root. 
                // So /assets/lamp.png works on 5173.
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Could not load products. Ensure the backend is running.');
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="container">Loading products...</div>;
    if (error) return <div className="container">{error}</div>;

    return (
        <section className="product-section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Trending Now</h2>
                    <p className="section-subtitle">Top picks for your daily lifestyle.</p>
                </div>

                <div className="product-grid">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductGrid;
