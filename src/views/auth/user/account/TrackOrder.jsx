import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, Truck, Home, CheckCircle, Clock } from 'lucide-react';

// Mock order details (replace with API call in production)
const mockOrderDetails = {
    'ORD-EM-5678': {
        status: 'Shipped',
        expectedDelivery: '2025-12-12',
        trackingNumber: 'TRK123456789',
        shippingProvider: 'EcoShip Logistics',
        timeline: [
            { status: 'Order Placed', time: '2025-12-01 10:15', icon: <Package size={16} /> },
            { status: 'Processed', time: '2025-12-02 08:45', icon: <CheckCircle size={16} /> },
            { status: 'Shipped', time: '2025-12-05 14:30', icon: <Truck size={16} /> },
        ],
        items: [
            { name: 'Bamboo Cutlery Set', qty: 1 },
            { name: 'Reusable Straw Pack', qty: 2 },
        ],
    },
    // Add more mock orders here
};

function TrackOrder() {
    const { orderId } = useParams();
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        setLoading(true);
        const data = mockOrderDetails[orderId];

        setTimeout(() => {
            if (data) {
                setOrderDetails(data);
                setError(false);
            } else {
                setError(true);
            }
            setLoading(false);
        }, 1000);
    }, [orderId]);

    if (loading) {
        return <div className="text-center p-5">Loading tracking details...</div>;
    }

    if (error || !orderDetails) {
        return <div className="text-center p-5 alert alert-danger">Order ID <strong>{orderId}</strong> not found or invalid.</div>;
    }

    const statusColor = orderDetails.status === 'Delivered'
        ? 'text-success'
        : orderDetails.status === 'Shipped'
        ? 'text-info'
        : 'text-warning';

    return (
        <div className="track-order-wrapper">
            <div className="container py-5">
                <h2 className="fw-bold mb-4 text-dark">
                    Track Order: <span className="text-success">{orderId}</span>
                </h2>

                {/* Current Status */}
                <div className="row g-4">
                    <div className="col-12">
                        <div className="card shadow-sm p-4 bg-light-success border-0">
                            <h4 className="mb-2 fw-bold">Current Status:</h4>
                            <div className={`display-6 fw-bold ${statusColor}`}>{orderDetails.status}</div>
                            {orderDetails.status !== 'Delivered' && (
                                <p className="lead mt-2">
                                    Expected Delivery: <span className="fw-bold">{orderDetails.expectedDelivery}</span>
                                </p>
                            )}
                            <p className="small text-muted mb-0">Tracking Number: {orderDetails.trackingNumber}</p>
                            <p className="small text-muted">Shipped via: {orderDetails.shippingProvider}</p>
                        </div>
                    </div>

                    {/* Tracking Timeline */}
                    <div className="col-12">
                        <div className="card shadow-sm p-4 border-0">
                            <h4 className="card-title mb-4">Tracking History</h4>
                            <div className="timeline-container">
                                {orderDetails.timeline.slice().reverse().map((event, index) => (
                                    <div key={index} className="timeline-item d-flex mb-4">
                                        <div className="timeline-icon me-3">
                                            <div className={`rounded-circle p-2 ${index === 0 ? 'bg-success text-white' : 'bg-light text-muted'}`}>
                                                {event.icon}
                                            </div>
                                        </div>
                                        <div className="timeline-content flex-grow-1 border-bottom pb-2">
                                            <h6 className="mb-0 fw-bold">{event.status}</h6>
                                            <small className="text-muted">{event.time}</small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="col-12">
                        <div className="card shadow-sm p-4 border-0">
                            <h4 className="card-title mb-3">Order Items</h4>
                            <ul className="list-group list-group-flush">
                                {orderDetails.items.map((item, index) => (
                                    <li key={index} className="list-group-item d-flex justify-content-between px-0">
                                        {item.name} <span className="fw-bold">Qty: {item.qty}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4 text-end">
                                <Link to="/account/orders" className="btn btn-outline-success">Back to Orders</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TrackOrder;
