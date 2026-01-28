import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, Leaf, Loader, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

function ProductApprovals() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Fetch pending products from backend
    const fetchPendingProducts = async () => {
        try {
            setLoading(true);
            const token = sessionStorage.getItem("token");
            const res = await axios.get('http://localhost:5000/api/admin/products/pending', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching products", err);
            toast.error("Failed to load products");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingProducts();
    }, []);

    // 2. Approve or reject a product
    const handleApproval = async (id, status) => {
        const confirmAction = window.confirm(`Are you sure you want to ${status ? 'Approve' : 'Reject'} this product?`);
        if (!confirmAction) return;

        try {
            const token = sessionStorage.getItem("token");
            await axios.post('http://localhost:5000/api/admin/products/verify', 
                { productId: id, status }, // status: true = Approve, false = Reject
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            toast.success(status ? "Product Approved!" : "Product Rejected!");
            fetchPendingProducts(); // Refresh the list
        } catch (err) {
            toast.error("Action failed. Try again.");
        }
    };

    return (
        <div className="product-approvals-wrapper p-4">
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between mb-4">
                <h2 className="fw-bold text-dark d-flex align-items-center m-0">
                    <Leaf size={30} className="me-2 text-success" /> Product Review & Approvals
                </h2>
                <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">
                    {products.length} Pending
                </span>
            </div>
            
            <div className="card shadow-sm border-0 rounded-4">
                <div className="card-body p-4">
                    {/* Info Alert */}
                    <div className="alert alert-info border-0 shadow-sm d-flex align-items-center mb-4">
                        <AlertCircle size={20} className="me-2" />
                        Review product details and 'Eco Claim' carefully before approving.
                    </div>

                    {loading ? (
                        <div className="p-5 text-center">
                            <Loader className="animate-spin text-success" size={40} />
                            <p className="mt-2 text-muted">Fetching pending products...</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Product Name</th>
                                        <th>Seller / Store</th>
                                        <th>Eco Claim & Details</th>
                                        <th className="text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center p-5 text-muted">
                                                No products pending for approval.
                                            </td>
                                        </tr>
                                    ) : (
                                        products.map(product => (
                                            <tr key={product._id}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="fw-bold text-dark">{product.name}</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="text-primary fw-semibold">
                                                        {product.sellerId?.storeName || 'Unknown Seller'}
                                                    </div>
                                                    <small className="text-muted">ID: {product.sellerId?._id?.slice(-6)}</small>
                                                </td>
                                                <td>
                                                    <span className="badge bg-secondary-subtle text-secondary border me-2">Eco Claim:</span>
                                                    <span className="text-dark small">{product.ecoClaim || "No claim provided"}</span>
                                                </td>
                                                <td className="text-center">
                                                    <div className="d-flex justify-content-center gap-2">
                                                        <button 
                                                            className="btn btn-success btn-sm d-flex align-items-center px-3" 
                                                            onClick={() => handleApproval(product._id, true)}
                                                        >
                                                            <CheckCircle size={16} className="me-1" /> Approve
                                                        </button>
                                                        <button 
                                                            className="btn btn-outline-danger btn-sm d-flex align-items-center px-3" 
                                                            onClick={() => handleApproval(product._id, false)}
                                                        >
                                                            <XCircle size={16} className="me-1" /> Reject
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductApprovals;
