import React, { useState } from 'react';
import { RefreshCcw, DollarSign, Package, CheckCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock return request data
const mockReturns = [
    { id: 'R001', orderId: 'ORD-EM-5678', product: 'Bamboo Cutlery Set', date: '2025-12-10', status: 'Pending Review', reason: 'Damaged item', refundAmount: 349 },
    { id: 'R002', orderId: 'ORD-EM-9101', product: 'Organic Cotton Towel', date: '2025-12-01', status: 'Approved', reason: 'Size issue', refundAmount: 799 },
    { id: 'R003', orderId: 'ORD-EM-1112', product: 'Natural Soap Bar', date: '2025-11-20', status: 'Refund Issued', reason: 'Dislike product', refundAmount: 199 },
];

function ReturnsAndRefunds() {
    const [isRequesting, setIsRequesting] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState('');

    const handleRequestSubmit = (e) => {
        e.preventDefault();
        alert(`Return request submitted for Order ${selectedOrder}. Check status in the table below.`);
        setIsRequesting(false);
        setSelectedOrder('');
        // TODO: send request to backend API
    };

    const renderStatusBadge = (status) => {
        switch (status) {
            case 'Refund Issued':
                return <span className="badge bg-success d-flex align-items-center gap-1"><CheckCircle size={14} /> {status}</span>;
            case 'Approved':
                return <span className="badge bg-info d-flex align-items-center gap-1"><DollarSign size={14} /> {status}</span>;
            case 'Pending Review':
            default:
                return <span className="badge bg-warning text-dark d-flex align-items-center gap-1"><AlertTriangle size={14} /> {status}</span>;
        }
    };

    return (
        <div className="returns-refunds-wrapper p-4">
            <h2 className="fw-bold mb-4 text-dark d-flex align-items-center">
                <RefreshCcw size={30} className="me-2 text-primary" /> Returns & Refunds
            </h2>

            {/* 1. New Return Request */}
            <div className="card shadow-sm mb-5">
                <div className="card-header bg-primary text-white fw-bold d-flex justify-content-between align-items-center">
                    Initiate a New Return
                    <button className="btn btn-sm btn-light" onClick={() => setIsRequesting(!isRequesting)}>
                        {isRequesting ? 'Cancel' : 'New Request'}
                    </button>
                </div>

                {isRequesting && (
                    <div className="card-body">
                        <form onSubmit={handleRequestSubmit}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label htmlFor="orderId" className="form-label">Select Order ID</label>
                                    <select
                                        id="orderId"
                                        className="form-select"
                                        required
                                        value={selectedOrder}
                                        onChange={(e) => setSelectedOrder(e.target.value)}
                                    >
                                        <option value="">-- Select recent order --</option>
                                        <option value="ORD-EM-5678">ORD-EM-5678 (Delivered 2025-12-05)</option>
                                        <option value="ORD-EM-9101">ORD-EM-9101 (Delivered 2025-11-25)</option>
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="reason" className="form-label">Reason for Return</label>
                                    <select className="form-select" id="reason" required>
                                        <option value="">-- Select reason --</option>
                                        <option value="Damaged">Damaged/Defective</option>
                                        <option value="Wrong Item">Wrong item received</option>
                                        <option value="Quality">Quality not as expected (Eco-Claim Issue)</option>
                                    </select>
                                </div>
                                <div className="col-12 text-end">
                                    <button type="submit" className="btn btn-success d-flex align-items-center ms-auto">
                                        <Package size={18} className="me-2" /> Submit Return Request
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            {/* 2. Return Status Table */}
            <h4 className="fw-bold mb-3 text-primary">Your Return Status History</h4>
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Return ID</th>
                                    <th>Order ID</th>
                                    <th>Product</th>
                                    <th>Status</th>
                                    <th>Reason</th>
                                    <th>Refund Est.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockReturns.map(req => (
                                    <tr key={req.id}>
                                        <td className="fw-bold">{req.id}</td>
                                        <td><Link to={`/account/track/${req.orderId}`}>{req.orderId}</Link></td>
                                        <td>{req.product}</td>
                                        <td>{renderStatusBadge(req.status)}</td>
                                        <td>{req.reason}</td>
                                        <td className="fw-bold text-success">₹{req.refundAmount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* 3. Policy Link */}
            <div className="mt-4 alert alert-light text-center small">
                Read our full <Link to="/returns-policy">Returns & Refund Policy</Link> for more details.
            </div>
        </div>
    );
}

export default ReturnsAndRefunds;
