import React from 'react';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import ProductGrid from '../components/products/ProductGrid';

const Home = () => {
    return (
        <>
            <Hero />
            <Features />
            <ProductGrid />
        </>
    );
};

export default Home;
