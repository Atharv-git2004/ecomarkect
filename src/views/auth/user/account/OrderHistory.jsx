import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Truck, CheckCircle, RefreshCw, ShoppingBag, ChevronRight, Clock } from 'lucide-react'; 
import axios from 'axios';

// ✅ Helper to render status badges
// കൺട്രോളറിൽ നിന്ന് വരുന്ന കൃത്യമായ സ്പെല്ലിംഗ് (Pending, Shipped, Delivered) ഇവിടെ മാച്ച് ചെയ്യണം
function getStatusBadge(status) {
    switch (status) {
        case 'Delivered':
            return (
                <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill border border-success-subtle d-flex align-items-center gap-1 w-fit">
                    <CheckCircle size={14} /> Delivered
                </span>
            );
        case 'Shipped':
            return (
                <span className="badge bg-warning-subtle text-warning-emphasis px-3 py-2 rounded-pill border border-warning-subtle d-flex align-items-center gap-1 w-fit">
                    <Truck size={14} /> Shipped
                </span>
            );
        case 'Pending':
        default:
            return (
                <span className="badge bg-info-subtle text-info-emphasis px-3 py-2 rounded-pill border border-info-subtle d-flex align-items-center gap-1 w-fit">
                    <Clock size={14} /> Processing
                </span>
            );
    }
}

function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (!userInfo || !userInfo.token) { 
                    setLoading(false); 
                    return; 
                }

                const config = { 
                    headers: { 
                        Authorization: `Bearer ${userInfo.token}` 
                    } 
                };

                // ✅ നിങ്ങളുടെ ബാക്കെൻഡ് URL കൃത്യമാണെന്ന് ഉറപ്പാക്കുക
                const BASE_URL = "http://localhost:5000"; 
                const { data } = await axios.get(`${BASE_URL}/api/orders/myorders`, config);
                
                setOrders(data);
            } catch (error) {
                console.error("❌ Fetch Error:", error.response ? error.response.data : error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchMyOrders();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-50 py-5">
                <RefreshCw className="animate-spin text-success" size={40} />
                <p className="ms-3 mb-0 text-muted">Loading your orders...</p>
            </div>
        );
    }

    return (
        <div className="order-history-wrapper bg-white min-vh-100 text-start">
            <div className="container py-5">

                {/* Header */}
                <div className="mb-5 border-start border-success border-4 ps-3">
                    <h2 className="fw-black m-0">Order History</h2>
                    <p className="text-muted small m-0">Manage and track your recent orders</p>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-5 shadow-sm rounded-4 border bg-light">
                        <ShoppingBag size={48} className="text-muted mb-3 opacity-25" />
                        <h4 className="fw-bold">No orders yet</h4>
                        <p className="text-muted">Looks like you haven't placed any orders yet.</p>
                        <Link to="/products" className="btn btn-success rounded-pill px-4 mt-2 shadow-sm">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="table-responsive shadow-sm rounded-4 border overflow-hidden">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light text-secondary">
                                <tr>
                                    <th className="ps-4 py-3 fw-semibold">Order ID</th>
                                    <th className="fw-semibold">Date</th>
                                    <th className="fw-semibold">Total Amount</th>
                                    <th className="fw-semibold">Status</th>
                                    <th className="pe-4 text-end fw-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order._id}>
                                        {/* Order ID */}
                                        <td className="ps-4">
                                            <span className="fw-bold text-dark">
                                                #{order._id.slice(-8).toUpperCase()}
                                            </span>
                                        </td>
                                        
                                        {/* Date */}
                                        <td className="text-muted">
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </td>

                                        {/* Total Amount */}
                                        <td className="fw-bold text-success">
                                            ₹{Number(order.totalPrice).toLocaleString('en-IN')}
                                        </td>

                                        {/* Status Badge */}
                                        <td>
                                            {getStatusBadge(order.status)}
                                        </td>

                                        {/* Action */}
                                        <td className="pe-4 text-end">
                                            <Link 
                                                to={`/order/${order._id}`} 
                                                className="btn btn-sm btn-outline-success rounded-pill px-3 d-inline-flex align-items-center gap-1 transition-all"
                                            >
                                                Details <ChevronRight size={14} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrderHistory;