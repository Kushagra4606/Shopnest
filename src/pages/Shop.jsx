import React from 'react';
import ProductGrid from '../components/products/ProductGrid';

const Shop = () => {
    return (
        <div className="shop-page">
            <div className="container" style={{ paddingTop: '2rem' }}>
                <h1 className="section-title">Shop All Products</h1>
            </div>
            <ProductGrid />
        </div>
    );
};

export default Shop;
