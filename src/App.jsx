import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import CartSidebar from './components/cart/CartSidebar'
import WishlistSidebar from './components/wishlist/WishlistSidebar'
import { AuthProvider } from './context/AuthContext'
import { CartProvider, useCart } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'

import Home from './pages/Home'
import Shop from './pages/Shop'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Signup from './pages/Signup'

// Inner App component to consume Context
const ShopNestApp = () => {
  const { isCartOpen, setIsCartOpen, cartCount } = useCart();

  return (
    <div className="app">
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <WishlistSidebar />
      <Header onOpenCart={() => setIsCartOpen(true)} cartCount={cartCount} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <ShopNestApp />
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
