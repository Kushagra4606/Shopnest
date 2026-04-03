import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const { addToCart } = useCart();

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                const found = data.find(p => p.id === parseInt(id));
                if (found) setProduct(found);
                else navigate('/shop');
            })
            .catch(err => console.error(err));
    }, [id, navigate]);

    if (!product) return <div className="pt-32 text-center">Loading product...</div>;
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
                    <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-gray-100 shadow-sm relative group">
                        <img className="w-full h-full object-cover" src={product.image} alt={product.name} />
                    </div>
                    <div className="grid grid-cols-5 gap-4">
                        <button className="aspect-square rounded-md overflow-hidden ring-2 ring-[#4800b2] ring-offset-2">
                            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnh5WVloQBVasfvX39jBHZh081Zci9shkuFYcdSqA6V29HN-aGGUadwzjjlmeOiXjh-X_u-29miqw6AiLlSTnUeWW03IiloTxo9KnUXh2ccXvV3yfteZ_4ZVKRajur6sC7xzlPosXaTHwF4bcImRQ1hkmb6rFVwQl0zCTg48VbPdS4IUg5i-FCotMiUTT5CxDJe7inVBu3DO2C3skR-s4uWbOwtRd7uYBZ9rwPjtbbkrRHF8NWI2o60I7V6D79JG7KQ5QX6EGasv0" alt="detail" />
                        </button>
                        <button className="aspect-square rounded-md overflow-hidden bg-gray-100 hover:opacity-80 transition-opacity">
                            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCSEnndlaa20sDlxPdnMoYFLuOmwTVP8uY_egAqi7aTtIfKlLMtZWbVx4F3V3bgzs8W_bOt7nUCSobIU-esnhiZ1zoB0yjQlr6Jq1PzlQuxm5SkJolt_-X6wwrkObTTvoBS4881mJCSUYC7PI4JKcCxn-iv49hANFHHSGECv4Y2y4oIKf4lCZYeiCAeWhcBEuis4O2c7tpU2lp8DnU5p3TwPUSINUhZ23tU1_mulipH7i5NM-BJW2pzYhyK3ZhtoyAIY8znv2rPPo" alt="detail" />
                        </button>
                        <button className="aspect-square rounded-md overflow-hidden bg-gray-100 hover:opacity-80 transition-opacity">
                            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCm1qo5kWIIMBRRzdY87Lh1DxdvTIF1O1nelIF1-qxS_I1YGzGlzY84R0jqBEHza_laysLt-U9PVNAPRdHL9uqD8CUJHBDlSzIs67tgln_SYenpiA81ESl3aEwa5YKjniEDH4X_yJox4CnjUf9wMggZe-comhiNp4inOqj-FRuJ5j-Mw3HIKdI0ZaCge4A2BZdgblAZnMXUpd6yQhJz7Ol27dABAXrLzd0zrUvC6je4r49g1L1l2RbJu-hcEe0rywioIL5-oXLS44g" alt="detail" />
                        </button>
                        <button className="aspect-square rounded-md overflow-hidden bg-gray-100 hover:opacity-80 transition-opacity">
                            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRDuSRn2NPvjtdYGMOkgTb_J4s9AdqhuNOcXEn9DEhMCFniz8DZPkDnqGzzosYU8ajX63oMXX7n-lrfS9WgtxEg23u9cAN5Qq98PnWKgSunims2RkBoYLe7sntXnbveLhdo2TzOFP91ep4cJBgke6VEEzsZEGwlE8fFcZ_NAopzjp5GcLfngWS1p31E6OrhcERpLSdG6j3sFGkCSIPVxMUWdm_vI6lFY1MMq5HYUrmMVwF1vLMvUXBXRcLn_mggA-3zgOzLjEN30E" alt="detail" />
                        </button>
                        <button className="aspect-square rounded-md overflow-hidden bg-gray-100 flex items-center justify-center relative">
                            <img className="w-full h-full object-cover opacity-40" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkmZjVsB7gnxYmjsGWsbuoK5QH-AGnmARx-1Ex-1l55rovfxqF4dL0QXbVmpUZlF1Plk1eef1gjX2IRciAfL8ZXrXoRB5mMxK7U0hXZ1MMzJOohhxCplLKExzT3WOlJrAAbCa-rO4Rgp3HQv7ZvN35AlJ_qR6BAhoVkA4naKKKZ3tFHmz5kNSeOCmAl5AnxgWZj32_i9_Hl4n65SIgZlmElBT5ZMEnbayD7S8dnlSH5Orq8aK3Ok6NePnTJChfK51xQbGzfU24MN4" alt="video thumbnail" />
                            <span className="material-symbols-outlined absolute text-3xl text-gray-900">play_circle</span>
                        </button>
                    </div>
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
                                <span className="text-5xl font-headline font-black text-[#4800b2] tracking-tighter">${product.price}</span>
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
                                <h3 className="font-headline font-bold text-lg text-gray-900">Group Buying Discount</h3>
                                <p className="text-xs text-gray-500">Unlock significant savings by buying with others.</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-gray-900">2 People</span>
                                    <span className="text-xs text-gray-500">Standard Duo</span>
                                </div>
                                <span className="text-[#4800b2] font-black">5% OFF</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-purple-50 ring-1 ring-[#4800b2]/20 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-[#4800b2]">5 People</span>
                                    <span className="text-xs text-[#4800b2]/70">Popular Choice</span>
                                </div>
                                <span className="text-[#4800b2] font-black">10% OFF</span>
                            </div>
                        </div>
                    </section>

                    {/* Actions */}
                    <div className="flex flex-col gap-4 mt-2">
                        <button 
                            onClick={(e) => { e.preventDefault(); addToCart(product); }}
                            className="bg-gradient-to-br from-[#4800b2] to-[#6200ee] text-white py-5 rounded-xl font-headline font-bold text-lg flex items-center justify-center gap-2 shadow-xl hover:opacity-90 active:scale-95 transition-all">
                            <span className="material-symbols-outlined">add_shopping_cart</span>
                            Add to Cart
                        </button>
                        <button className="border-2 border-[#4800b2] text-[#4800b2] py-4 rounded-xl font-headline font-bold flex items-center justify-center gap-2 hover:bg-[#4800b2]/5 transition-colors active:scale-95">
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
