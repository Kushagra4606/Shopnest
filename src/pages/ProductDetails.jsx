import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [activeImage, setActiveImage] = useState(null);
    const [groupOption, setGroupOption] = useState('none'); // 'none', '2', '5'
    const { addToCart } = useCart();

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                const found = data.find(p => p.id === parseInt(id));
                if (found) {
                    setProduct(found);
                    setActiveImage(found.image);
                }
                else navigate('/shop');
            })
            .catch(err => console.error(err));
    }, [id, navigate]);

    if (!product) return <div className="pt-32 text-center">Loading product...</div>;

    let imageList = [];
    try {
        imageList = product.images ? JSON.parse(product.images) : [];
    } catch (e) {
        imageList = [];
    }
    if (!Array.isArray(imageList) || imageList.length === 0) {
        imageList = product.image ? [product.image] : [];
    }

    const currentPrice = 
        groupOption === 'none' 
            ? product.price 
            : groupOption === '2' 
                ? product.price * 0.95 
                : product.price * 0.90;

    const handleAddToCart = (e) => {
        e.preventDefault();
        let cartProduct = { ...product };
        if (groupOption === '2') {
            cartProduct.price = product.price * 0.95;
            cartProduct.name = `${product.name} (2-People Group)`;
        } else if (groupOption === '5') {
            cartProduct.price = product.price * 0.90;
            cartProduct.name = `${product.name} (5-People Group)`;
        }
        addToCart(cartProduct);
    };

    const handleJoinGroupOrder = (e) => {
        e.preventDefault();
        if (groupOption === 'none') {
            alert('Please select a 2-People or 5-People group buying option first!');
            return;
        }
        let cartProduct = { ...product };
        if (groupOption === '2') {
            cartProduct.price = product.price * 0.95;
            cartProduct.name = `${product.name} (2-People Group)`;
            alert(`Joined Group Order! You and 1 friend will get 5% OFF. Price: $${cartProduct.price.toLocaleString()}`);
        } else if (groupOption === '5') {
            cartProduct.price = product.price * 0.90;
            cartProduct.name = `${product.name} (5-People Group)`;
            alert(`Joined Group Order! You and 4 friends will get 10% OFF. Price: $${cartProduct.price.toLocaleString()}`);
        }
        addToCart(cartProduct);
    };

    return (
        <div className="pt-24 pb-12 max-w-screen-2xl mx-auto px-6 font-body">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 mb-8 text-sm text-gray-500">
                <Link to="/" className="hover:text-[#4800b2]">Home</Link>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <Link to="/shop" className="hover:text-[#4800b2]">Curated Living</Link>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span className="text-gray-900 font-medium">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left: Product Media */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-gray-100 shadow-sm relative group border border-gray-100">
                        <img className="w-full h-full object-cover transition-all duration-300" src={activeImage || product.image} alt={product.name} />
                    </div>
                    {imageList.length > 1 && (
                        <div className="grid grid-cols-6 gap-4">
                            {imageList.map((url, index) => {
                                const isActive = activeImage === url;
                                return (
                                    <button 
                                        key={index}
                                        onClick={() => setActiveImage(url)}
                                        className={`aspect-square rounded-xl overflow-hidden bg-gray-50 border-2 transition-all ${
                                            isActive ? 'border-[#4800b2] ring-2 ring-[#4800b2]/20 scale-105' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <img className="w-full h-full object-cover" src={url} alt={`detail ${index}`} />
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Right: Product Information */}
                <div className="lg:col-span-5 flex flex-col gap-8">
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-[#fdaa90] text-[#783c28] text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">Editor's Choice</span>
                            <div className="flex items-center text-amber-400">
                                {[1,2,3,4].map(i => <span key={i} className="material-symbols-outlined text-sm">star</span>)}
                                <span className="material-symbols-outlined text-sm">star_half</span>
                                <span className="ml-2 text-xs text-gray-500 font-medium">(1,284 reviews)</span>
                            </div>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-headline font-extrabold text-gray-900 tracking-tight mb-2">{product.name}</h1>
                        <p className="text-gray-500 text-lg leading-relaxed mb-6">{product.description}</p>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-end gap-4">
                                <span className="text-5xl font-headline font-black text-[#4800b2] tracking-tighter">${currentPrice.toLocaleString()}</span>
                                <div className="flex flex-col mb-1">
                                    <span className="bg-[#fdaa90] text-[#783c28] px-3 py-1 rounded-md text-xs font-bold inline-flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">trending_up</span>
                                        Price adjusted due to high demand
                                    </span>
                                </div>
                            </div>
                            
                            {/* Trend chart */}
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">7-Day Trend</span>
                                    <span className="text-[10px] text-[#4800b2] font-bold">+4.2% from last week</span>
                                </div>
                                <div className="h-12 w-full flex items-end gap-1 px-1">
                                    {[0.5, 0.66, 0.5, 0.75, 0.8, 1, 1.1].map((h, i) => (
                                        <div key={i} className="w-full rounded-t-sm" style={{height: `${h*100}%`, backgroundColor: i === 6 ? '#4800b2' : '#cfbdff'}}></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Group Buying Section */}
                    <section className="bg-white p-6 rounded-xl shadow-sm ring-1 ring-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-[#e8ddff] rounded-lg text-[#4800b2]">
                                <span className="material-symbols-outlined">groups</span>
                            </div>
                            <div>
                                <h3 className="font-headline font-bold text-lg text-gray-900">Buying Options</h3>
                                <p className="text-xs text-gray-500">Select a buying mode to unlock exclusive discounts.</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {/* Standard Option */}
                            <div 
                                onClick={() => setGroupOption('none')}
                                className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition-all border ${
                                    groupOption === 'none' 
                                        ? 'bg-purple-50/50 border-[#4800b2] ring-1 ring-[#4800b2]/20' 
                                        : 'bg-gray-50 border-transparent hover:bg-gray-100/75'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-[18px] text-gray-500">person</span>
                                    <div>
                                        <span className="text-sm font-bold text-gray-900 block">Single Purchase</span>
                                        <span className="text-[10px] text-gray-500">Standard checkout price</span>
                                    </div>
                                </div>
                                <span className="text-gray-900 font-bold">${product.price.toLocaleString()}</span>
                            </div>

                            {/* 2 People Option */}
                            <div 
                                onClick={() => setGroupOption('2')}
                                className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition-all border ${
                                    groupOption === '2' 
                                        ? 'bg-purple-50/50 border-[#4800b2] ring-1 ring-[#4800b2]/20' 
                                        : 'bg-gray-50 border-transparent hover:bg-gray-100/75'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-[18px] text-[#4800b2]">group</span>
                                    <div>
                                        <span className="text-sm font-bold text-gray-900 block">2 People Group</span>
                                        <span className="text-[10px] text-gray-500">Buy together &amp; save 5%</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block text-[#4800b2] font-black">${(product.price * 0.95).toLocaleString()}</span>
                                    <span className="text-[9px] line-through text-gray-400">${product.price.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* 5 People Option */}
                            <div 
                                onClick={() => setGroupOption('5')}
                                className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition-all border ${
                                    groupOption === '5' 
                                        ? 'bg-purple-50/50 border-[#4800b2] ring-1 ring-[#4800b2]/20' 
                                        : 'bg-gray-50 border-transparent hover:bg-gray-100/75'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-[18px] text-[#4800b2]">groups</span>
                                    <div>
                                        <span className="text-sm font-bold text-[#4800b2] block">5 People Group</span>
                                        <span className="text-[10px] text-gray-500">Buy together &amp; save 10%</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block text-[#4800b2] font-black">${(product.price * 0.90).toLocaleString()}</span>
                                    <span className="text-[9px] line-through text-gray-400">${product.price.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Actions */}
                    <div className="flex flex-col gap-4 mt-2">
                        <button 
                            onClick={handleAddToCart}
                            className="bg-gradient-to-br from-[#4800b2] to-[#6200ee] text-white py-5 rounded-xl font-headline font-bold text-lg flex items-center justify-center gap-2 shadow-xl hover:opacity-90 active:scale-95 transition-all">
                            <span className="material-symbols-outlined">add_shopping_cart</span>
                            Add to Cart
                        </button>
                        <button 
                            onClick={handleJoinGroupOrder}
                            className={`py-4 rounded-xl font-headline font-bold flex items-center justify-center gap-2 transition-all active:scale-95 border-2 ${
                                groupOption !== 'none'
                                    ? 'bg-[#4800b2] text-white border-[#4800b2] shadow-lg shadow-[#4800b2]/20'
                                    : 'border-[#4800b2] text-[#4800b2] hover:bg-[#4800b2]/5'
                            }`}
                        >
                            <span className="material-symbols-outlined">group_add</span>
                            Join Group Order
                        </button>
                    </div>
                </div>
            </div>

            {/* Curated Features Bento */}
            <section className="mt-24">
                <h2 className="text-3xl font-headline font-extrabold text-gray-900 mb-10 tracking-tight text-center">Curated Intelligence</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-white p-8 rounded-xl ring-1 ring-gray-100 flex flex-col justify-between group overflow-hidden relative">
                        <div className="relative z-10">
                            <span className="material-symbols-outlined text-[#4800b2] text-4xl mb-4">spatial_audio</span>
                            <h4 className="text-2xl font-headline font-bold text-gray-900 mb-2">360° Acoustic Envelope</h4>
                            <p className="text-gray-500 leading-relaxed max-w-md">Our proprietary waveguide technology creates a sonic experience that adapts to your room's unique geometry.</p>
                        </div>
                        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#e8ddff] opacity-50 rounded-full blur-3xl group-hover:scale-125 transition-transform"></div>
                    </div>
                    <div className="bg-[#4800b2] text-white p-8 rounded-xl flex flex-col justify-center items-center text-center">
                        <span className="material-symbols-outlined text-5xl mb-4">nest_eco_leaf</span>
                        <h4 className="text-xl font-headline font-bold mb-2">Sustainably Sourced</h4>
                        <p className="text-white/80 text-sm">Recycled aluminum and ethical textiles in every unit.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProductDetails;
