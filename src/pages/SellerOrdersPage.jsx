import React, { useState, useEffect } from 'react';
// ഇംപോർട്ട് പാത്ത് നിങ്ങളുടെ പ്രോജക്റ്റിന് അനുസരിച്ച് ഉറപ്പുവരുത്തുക
import { GetSellerOrdersApi, UpdateOrderStatusApi } from '../Redux/service/AllApi';
import { Package, Clock, RefreshCcw, CheckCircle, Truck, MapPin, Phone, User } from 'lucide-react';

const SellerOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = sessionStorage.getItem("token");
            if (token) {
                const header = {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                };
                const result = await GetSellerOrdersApi(header);
                
                if (result.status === 200 || result.status === 201) {
                    setOrders(result.data);
                }
            } else {
                console.error("No token found");
            }
        } catch (err) {
            console.error("Error fetching orders:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const token = sessionStorage.getItem("token");
            const header = { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            };
            
            // API call to update status
            const result = await UpdateOrderStatusApi(orderId, { status: newStatus }, header);
            
            if (result.status === 200) {
                alert(`Order status updated to: ${newStatus}`);
                fetchOrders(); // പട്ടിക പുതുക്കാൻ
            }
        } catch (err) {
            console.error("Update failed:", err);
            alert("Status update failed. Please try again.");
        }
    };

    return (
        <div className="p-4 bg-light min-vh-100 text-start">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="text-dark fw-bold d-flex align-items-center m-0">
                    <Package className="text-success me-2" /> Order Management
                </h3>
                <button onClick={fetchOrders} className="btn btn-outline-success btn-sm rounded-pill shadow-sm">
                    <RefreshCcw size={16} className="me-1" /> Refresh
                </button>
            </div>

            <hr className="mb-4" />

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-success" role="status"></div>
                    <p className="mt-2 text-muted small">Loading orders...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-5 bg-white rounded-4 shadow-sm border">
                    <Clock size={48} className="text-muted mb-3 opacity-25" />
                    <p className="text-muted fw-bold">പുതിയ ഓർഡറുകൾ ഒന്നും തന്നെ ലഭിച്ചിട്ടില്ല.</p>
                </div>
            ) : (
                <div className="table-responsive bg-white shadow-sm rounded-4 p-3 border">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr className="small text-uppercase text-muted">
                                <th>Order ID</th>
                                <th>Customer Details</th>
                                <th>Items</th>
                                <th>Total Amount</th>
                                <th>Current Status</th>
                                <th className="text-center">Set Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id}>
                                    <td className="fw-bold text-primary">
                                        #{order._id.slice(-6).toUpperCase()}
                                    </td>
                                    <td>
                                        <div className="d-flex flex-column">
                                            <span className="fw-bold text-dark">
                                                <User size={14} className="me-1" /> 
                                                {order.shippingAddress?.name || order.user?.userName || "Unknown"}
                                            </span>
                                            <span className="text-muted small">
                                                <Phone size={12} className="me-1" />
                                                {order.shippingAddress?.phone || "No Phone"}
                                            </span>
                                            <span className="text-muted extra-small text-truncate" style={{maxWidth: '150px'}}>
                                                <MapPin size={12} className="me-1" />
                                                {order.shippingAddress?.city}, {order.shippingAddress?.pincode}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge bg-secondary rounded-pill">
                                            {order.orderItems?.length || 0} Items
                                        </span>
                                    </td>
                                    <td className="fw-bold text-dark text-nowrap">₹{order.totalPrice?.toLocaleString()}</td>
                                    <td>
                                        <span className={`badge px-3 py-2 rounded-pill ${
                                            order.status === 'Delivered' ? 'bg-success' : 
                                            order.status === 'Shipped' ? 'bg-info text-dark' : 
                                            'bg-warning text-dark'
                                        }`}>
                                            {order.status || "Pending"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="d-flex justify-content-center gap-2">
                                            <button 
                                                title="Mark as Shipped"
                                                onClick={() => handleStatusUpdate(order._id, 'Shipped')}
                                                className="btn btn-sm btn-outline-info rounded-circle p-2"
                                                disabled={order.status === 'Shipped' || order.status === 'Delivered'}
                                            >
                                                <Truck size={18} />
                                            </button>
                                            <button 
                                                title="Mark as Delivered"
                                                onClick={() => handleStatusUpdate(order._id, 'Delivered')}
                                                className="btn btn-sm btn-outline-success rounded-circle p-2"
                                                disabled={order.status === 'Delivered'}
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default SellerOrdersPage;