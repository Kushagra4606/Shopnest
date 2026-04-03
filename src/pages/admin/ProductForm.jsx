import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        image: ''
    });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditMode);
    const { currentUser } = useAuth();

    useEffect(() => {
        if (isEditMode) {
            fetch('/api/products')
                .then(res => res.json())
                .then(products => {
                    const product = products.find(p => p.id === parseInt(id));
                    if (product) {
                        setFormData({
                            name: product.name,
                            description: product.description,
                            price: product.price,
                            image: product.image
                        });
                    }
                    setInitialLoading(false);
                })
                .catch(err => {
                    console.error("Failed to load product", err);
                    setInitialLoading(false);
                });
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);

        const token = localStorage.getItem('token');
        setLoading(true);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: uploadData
            });

            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({ ...prev, image: data.url }));
            } else {
                const data = await res.json();
                alert(data.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            const url = isEditMode ? `/api/products/${id}` : '/api/products';
            const method = isEditMode ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                navigate('/admin');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to save product');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error saving product');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return (
        <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center">
            <div className="text-xl font-bold text-gray-500">Loading product details...</div>
        </div>
    );

    return (
        <div className="bg-[#f9f9f9] text-[#1a1c1c] font-body min-h-screen flex w-full absolute inset-0 z-50">
            {/* SideNavBar */}
            <aside className="h-full w-64 fixed left-0 top-0 bg-zinc-900 flex flex-col py-6 z-50 shadow-2xl shadow-violet-900/20">
                <div className="text-xl font-bold text-white mb-8 px-6 tracking-tighter">ShopNest</div>
                <div className="px-4 mb-4">
                    <p className="text-[10px] uppercase tracking-[0.1em] text-zinc-500 font-bold px-2 mb-4">Main Menu</p>
                    <nav className="space-y-1">
                        {/* Dashboard */}
                        <a className="flex items-center text-zinc-400 hover:text-white mx-2 my-1 px-4 py-3 hover:bg-zinc-800 transition-all duration-200 rounded-xl group" href="#">
                            <span className="material-symbols-outlined mr-3">dashboard</span>
                            <span className="font-['Inter'] text-sm tracking-wide">Dashboard</span>
                        </a>
                        {/* Inventory */}
                        <Link to="/admin" className="text-zinc-400 hover:text-white mx-2 my-1 px-4 py-3 hover:bg-zinc-800 transition-all duration-200 rounded-xl flex items-center group">
                            <span className="material-symbols-outlined mr-3">inventory_2</span>
                            <span className="font-['Inter'] text-sm tracking-wide font-bold">Inventory</span>
                        </Link>
                        <Link to="/admin" className="bg-violet-600/20 text-violet-300 rounded-xl mx-2 my-1 px-4 py-3 border-l-4 border-violet-500 flex items-center group">
                            <span className="material-symbols-outlined mr-3" style={{fontVariationSettings: "'FILL' 1"}}>payments</span>
                            <span className="font-['Inter'] text-sm tracking-wide font-bold">{isEditMode ? 'Edit Product' : 'Add Product'}</span>
                        </Link>
                        {/* Go back */}
                        <Link to="/" className="flex items-center text-zinc-400 hover:text-white mx-2 my-1 px-4 py-3 hover:bg-zinc-800 transition-all duration-200 rounded-xl group">
                            <span className="material-symbols-outlined mr-3">store</span>
                            <span className="font-['Inter'] text-sm tracking-wide">Return to Store</span>
                        </Link>
                    </nav>
                </div>
                <div className="mt-auto px-4">
                    <div className="flex items-center p-4 bg-zinc-800/50 rounded-2xl mb-4">
                        <div className="w-10 h-10 rounded-full bg-violet-500/30 flex items-center justify-center mr-3 text-white font-bold">
                            {currentUser?.email?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-white text-sm font-bold truncate">Admin Portal</p>
                            <p className="text-zinc-500 text-[10px] truncate">{currentUser?.email || 'Admin user'}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-grow ml-64 min-h-screen bg-[#f9f9f9] transition-all w-full p-0 m-0">
                <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl px-10 py-8 flex items-center gap-4 border-b border-gray-100">
                    <button onClick={() => navigate('/admin')} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <span className="material-symbols-outlined text-gray-500">arrow_back</span>
                    </button>
                    <div>
                        <h1 className="text-3xl font-headline font-extrabold tracking-tight text-[#1a1c1c]">
                            {isEditMode ? 'Edit Product Configuration' : 'New Product Configuration'}
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Configure pricing, details, and dynamic settings below</p>
                    </div>
                </header>

                <div className="p-10 max-w-4xl">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden p-8 border border-gray-100">
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">Product Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. Premium Leather Bag"
                                        className="w-full bg-[#f3f3f4] border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#4800b2] transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        rows={4}
                                        placeholder="Describe the product..."
                                        className="w-full bg-[#f3f3f4] border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#4800b2] transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">Price ($)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            required
                                            min="0"
                                            step="0.01"
                                            placeholder="0.00"
                                            className="w-full bg-[#f3f3f4] border-none rounded-lg pl-8 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#4800b2] transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">Product Image</label>
                                    
                                    <div className="flex gap-4">
                                        <div className="flex-1 w-full bg-[#f3f3f4] border-none rounded-lg px-4 py-3 text-sm focus-within:ring-2 focus-within:ring-[#4800b2] transition-all">
                                            <input
                                                type="url"
                                                name="image"
                                                value={formData.image}
                                                onChange={handleChange}
                                                required
                                                placeholder="https://example.com/image.jpg"
                                                className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm"
                                            />
                                        </div>
                                        <div className="relative overflow-hidden w-auto flex-shrink-0 cursor-pointer text-[#4800b2] font-semibold flex items-center justify-center px-4 bg-[#e8ddff] rounded-lg cursor-pointer">
                                            <span>Upload Image</span>
                                            <input 
                                                type="file" 
                                                className="absolute inset-0 opacity-0 cursor-pointer" 
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>
                                    {loading && <p className="text-sm mt-2 text-gray-500">Uploading...</p>}

                                    {formData.image && (
                                        <div className="mt-4 w-32 h-32 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
                                <button type="submit" disabled={loading} className="bg-gradient-to-br from-[#4800b2] to-[#6200ee] text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:shadow-[#4800b2]/30 active:scale-95 transition-all flex items-center gap-2">
                                    <span className="material-symbols-outlined">save</span>
                                    {loading ? 'Saving...' : (isEditMode ? 'Update Product' : 'Create Product')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProductForm;
