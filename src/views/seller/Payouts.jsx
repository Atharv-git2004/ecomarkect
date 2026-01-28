import React, { useState, useEffect } from 'react';
import { Package, CheckCircle, ArrowLeft, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GetSellerFinanceApi } from '../../Redux/service/AllApi'; 

function Payouts() {
    const [financeData, setFinanceData] = useState({
        lifetimeEarnings: 0,
        deliveredItems: []
    });
    
    const [loading, setLoading] = useState(true);

    // Fetch finance data from backend
    const fetchFinanceData = async () => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        const header = { "Authorization": `Bearer ${token}` };
        try {
            setLoading(true);
            const result = await GetSellerFinanceApi(header);
            
            if (result && (result.status === 200 || result.status === 201)) {
                const data = result.data;
                setFinanceData({
                    lifetimeEarnings: data.lifetimeEarnings || 0,
                    deliveredItems: data.deliveredItems || []
                });
            }
        } catch (err) {
            console.error("Finance Data Fetch Error:", err);
            // Provide default data on error to prevent UI break
            setFinanceData({ lifetimeEarnings: 0, deliveredItems: [] });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFinanceData();
    }, []);

    if (loading) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '80vh' }}>
                <div className="spinner-border text-success mb-2" role="status"></div>
                <p className="text-muted small">Fetching available data...</p>
            </div>
        );
    }

    return (
        <div className="payouts-wrapper p-4 bg-light min-vh-100 text-start">
            {/* Header */}
            <div className="d-flex align-items-center mb-4">
                <Link to="/seller/dashboard" className="btn btn-white rounded-circle me-3 shadow-sm p-2 border bg-white text-dark">
                    <ArrowLeft size={20} />
                </Link>
                <h2 className="fw-bold mb-0 text-dark">Payouts & Revenue</h2>
            </div>

            {/* Finance Overview Card */}
            <div className="row g-4 mb-5">
                <div className="col-md-12">
                    <div className="card border-0 shadow-sm text-center p-4" style={{ borderRadius: '15px' }}>
                        <div className="card-body">
                            <div className="bg-success bg-opacity-10 rounded-circle d-inline-block p-3 mb-3 text-success">
                                <TrendingUp size={32} />
                            </div>
                            <h6 className="text-muted fw-medium small mb-2 text-uppercase ls-1">Total Lifetime Earnings</h6>
                            <h1 className="fw-bold text-dark display-5">
                                ₹{(financeData.lifetimeEarnings || 0).toLocaleString('en-IN')}
                            </h1>
                            <div className="d-flex justify-content-center align-items-center mt-2">
                                <CheckCircle size={16} className="text-success me-1" />
                                <p className="text-muted small mb-0">Revenue from delivered orders</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delivered Products Table */}
            <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                <div className="card-header bg-white border-0 p-4 d-flex justify-content-between align-items-center border-bottom">
                    <h5 className="mb-0 fw-bold">Sales History (Delivered)</h5>
                    <span className="badge bg-success bg-opacity-10 text-success text-uppercase p-2">
                        {financeData.deliveredItems.length} Products
                    </span>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-4 py-3 border-0 text-muted small">Product Details</th>
                                    <th className="border-0 text-muted text-center small">Qty</th>
                                    <th className="border-0 text-muted small">Unit Price</th>
                                    <th className="border-0 text-muted small">Revenue</th>
                                    <th className="pe-4 border-0 text-end text-muted small">Delivery Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {financeData.deliveredItems.length > 0 ? (
                                    financeData.deliveredItems.map((item, index) => (
                                        <tr key={index}>
                                            <td className="ps-4">
                                                <div className="d-flex align-items-center">
                                                    <div className="bg-light p-2 rounded me-3">
                                                        <Package size={18} className="text-secondary" />
                                                    </div>
                                                    <span className="fw-bold text-dark">{item.productName || item.name}</span>
                                                </div>
                                            </td>
                                            <td className="text-center">{item.quantity || item.qty}</td>
                                            <td className="text-muted">₹{(item.price || 0).toLocaleString('en-IN')}</td>
                                            <td className="fw-bold text-dark text-nowrap">
                                                ₹{(item.total || ((item.price || 0) * (item.quantity || item.qty || 0))).toLocaleString('en-IN')}
                                            </td>
                                            <td className="pe-4 text-end text-muted small">
                                                {item.deliveryDate ? new Date(item.deliveryDate).toLocaleDateString('en-GB') : "N/A"}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5">
                                            <div className="text-muted opacity-25 mb-2"><Package size={48} /></div>
                                            <p className="text-muted mb-0 fw-bold">No delivered orders available yet.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Payouts;
