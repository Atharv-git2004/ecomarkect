import React, { useState, useEffect } from 'react';
import { Package, Clock, ShoppingBag, Eye, XCircle, MapPin, Phone, User } from 'lucide-react';
import { toast } from 'react-toastify';
import { GetMyOrdersApi, CancelOrderApi } from '../Redux/service/AllApi'; 

function MyOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = sessionStorage.getItem("token") || localStorage.getItem("token");
            if (token) {
                const header = {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                };
                const result = await GetMyOrdersApi(header);
                if (result && result.status === 200) {
                    setOrders(result.data);
                }
            }
        } catch (err) {
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleCancelOrder = async (orderId) => {
        if (window.confirm("Are you sure you want to cancel this order?")) {
            try {
                const token = sessionStorage.getItem("token") || localStorage.getItem("token");
                const header = { "Authorization": `Bearer ${token}` };
                const result = await CancelOrderApi(orderId, header);

                if (result && (result.status === 200 || result.status === 204)) {
                    toast.success("Order Cancelled Successfully");
                    const modalElement = document.getElementById('orderModal');
                    const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
                    if(modalInstance) modalInstance.hide();
                    fetchOrders(); 
                }
            } catch (err) {
                toast.error("Something went wrong!");
            }
        }
    };

    return (
        <div className="container py-5 text-start" style={{ minHeight: '80vh' }}>
            <h3 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: '#1a4d2e' }}>
                <Package className="text-success" size={28} /> My Orders
            </h3>

            {loading ? (
                <div className="text-center py-5"><div className="spinner-border text-success"></div></div>
            ) : orders.length === 0 ? (
                <div className="text-center py-5 shadow-sm rounded-4 bg-white border">
                    <ShoppingBag size={48} className="text-muted mb-3" />
                    <h5>No Orders Found</h5>
                </div>
            ) : (
                <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="ps-4">Order ID</th>
                                    <th>Date</th>
                                    <th>Items</th>
                                    <th>Customer Details</th>
                                    <th>Total Amount</th>
                                    <th>Status</th>
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id}>
                                        <td className="ps-4 fw-bold text-primary">#{order._id.slice(-6).toUpperCase()}</td>
                                        <td className="small text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <span className="badge bg-secondary rounded-pill">
                                                {order.orderItems?.length} {order.orderItems?.length === 1 ? 'Item' : 'Items'}
                                            </span>
                                        </td>
                                        <td className="small">
                                            <div className="d-flex flex-column">
                                                <span className="fw-bold"><User size={12}/> {order.shippingAddress?.name}</span>
                                                <span className="text-muted"><Phone size={12}/> {order.shippingAddress?.phone}</span>
                                            </div>
                                        </td>
                                        <td className="fw-bold">₹{Number(order.totalPrice).toLocaleString()}</td>
                                        <td>
                                            <span className={`badge px-3 py-2 rounded-pill ${
                                                order.status === 'Delivered' ? 'bg-success' : 
                                                order.status === 'Shipped' ? 'bg-info' : 
                                                order.status === 'Cancelled' ? 'bg-danger' : 'bg-warning text-dark'
                                            }`}>
                                                {order.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <button 
                                                className="btn btn-light btn-sm rounded-circle shadow-sm"
                                                onClick={() => setSelectedOrder(order)}
                                                data-bs-toggle="modal" data-bs-target="#orderModal"
                                            >
                                                <Eye size={18} className="text-success" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* --- 📦 ORDER DETAILS MODAL --- */}
            <div className="modal fade" id="orderModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content border-0 rounded-4 shadow">
                        <div className="modal-header border-0 pb-0">
                            <h5 className="fw-bold text-success d-flex align-items-center gap-2"><Package size={20}/> Order Details</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body p-4">
                            {selectedOrder && (
                                <div className="row g-4">
                                    <div className="col-md-7 border-end">
                                        <h6 className="fw-bold mb-3">Items Ordered</h6>
                                        {selectedOrder.orderItems?.map((item, idx) => (
                                            <div key={idx} className="d-flex align-items-center gap-3 mb-3 pb-2 border-bottom">
                                                <img src={item.image} alt="" className="rounded" style={{width:'50px', height:'50px', objectFit:'cover'}} />
                                                <div className="flex-grow-1">
                                                    <p className="small fw-bold mb-0">{item.name}</p>
                                                    <small className="text-muted">Qty: {item.qty || item.quantity} × ₹{item.price}</small>
                                                </div>
                                                <span className="fw-bold text-success">₹{(Number(item.price) * Number(item.qty || item.quantity)).toLocaleString()}</span>
                                            </div>
                                        ))}
                                        <div className="d-flex justify-content-between mt-3">
                                            <span className="fw-bold">Total Paid:</span>
                                            <span className="fw-bold text-success fs-5">₹{Number(selectedOrder.totalPrice).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-5">
                                        <h6 className="fw-bold mb-2"><MapPin size={16} className="text-success"/> Shipping Address</h6>
                                        <div className="bg-light p-3 rounded-3 small mb-4">
                                            <p className="fw-bold mb-1">{selectedOrder.shippingAddress?.name}</p>
                                            <p className="mb-1">{selectedOrder.shippingAddress?.house}</p>
                                            <p className="mb-1">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.pincode}</p>
                                            <p className="fw-bold mb-0">Ph: {selectedOrder.shippingAddress?.phone}</p>
                                        </div>
                                        <button 
                                            className="btn btn-danger w-100 rounded-pill fw-bold"
                                            onClick={() => handleCancelOrder(selectedOrder._id)}
                                            disabled={selectedOrder.status === 'Delivered' || selectedOrder.status === 'Cancelled'}
                                        >
                                            <XCircle size={18} /> Cancel Order
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyOrdersPage;