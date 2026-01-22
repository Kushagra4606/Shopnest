import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Trash2, Edit, Plus, Package } from 'lucide-react';
import './Admin.css';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                setProducts(products.filter(p => p.id !== id));
            } else {
                alert('Failed to delete product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    if (loading) return <div className="loading">Loading products...</div>;

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <Link to="/admin/add" className="btn btn-primary">
                    <Plus size={20} style={{ marginRight: '0.5rem' }} />
                    Add Product
                </Link>
            </div>

            <div className="products-table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>
                                    <img src={product.image} alt={product.name} className="product-thumbnail" />
                                </td>
                                <td className="product-name-cell">
                                    <span className="product-name">{product.name}</span>
                                    <span className="product-desc-truncate">{product.description}</span>
                                </td>
                                <td>${product.price}</td>
                                <td>
                                    <div className="action-buttons">
                                        <Link to={`/admin/edit/${product.id}`} className="btn-icon edit">
                                            <Edit size={18} />
                                        </Link>
                                        <button onClick={() => handleDelete(product.id)} className="btn-icon delete">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {products.length === 0 && (
                    <div className="empty-state">
                        <Package size={48} />
                        <p>No products found. Add some!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
