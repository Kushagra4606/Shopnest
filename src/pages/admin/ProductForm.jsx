import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import './Admin.css';

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

        const formData = new FormData();
        formData.append('image', file);

        const token = localStorage.getItem('token');
        setLoading(true);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
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

    if (initialLoading) return <div className="loading">Loading product details...</div>;

    return (
        <div className="admin-container">
            <button onClick={() => navigate('/admin')} className="back-link">
                <ArrowLeft size={18} /> Back to Dashboard
            </button>

            <div className="form-card">
                <h1>{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Product Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Premium Leather Bag"
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            placeholder="Describe the product..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Price ($)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                        />
                    </div>

                    <div className="form-group">
                        <label>Product Image</label>
                        <div style={{ marginBottom: '1rem' }}>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept="image/*"
                                style={{ border: 'none', padding: 0 }}
                                disabled={loading}
                            />
                            {loading && <span style={{ fontSize: '0.9rem', color: '#666' }}>Uploading...</span>}
                        </div>

                        <label style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Or Image URL</label>
                        <input
                            type="url"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            required
                            placeholder="https://example.com/image.jpg"
                        />
                        {formData.image && (
                            <div className="image-preview">
                                <img src={formData.image} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
                            </div>
                        )}
                    </div>

                    <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
                        <Save size={18} />
                        {loading ? 'Saving...' : (isEditMode ? 'Update Product' : 'Create Product')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
