import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CheckCircle, XCircle, Loader, UserCheck } from 'lucide-react';

function SellerVerification() {
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all pending seller applications from the backend
    const fetchSellers = async () => {
        try {
            setLoading(true);
            const token = sessionStorage.getItem("token");
            const res = await axios.get('http://localhost:5000/api/admin/sellers/pending', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSellers(res.data);
        } catch (err) {
            console.error("Error fetching sellers", err);
            toast.error("Failed to load seller applications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSellers();
    }, []);

    // Approve or Reject a seller application
    const handleVerify = async (id, status) => {
        const confirmMsg = `Are you sure you want to mark this seller as ${status}?`;
        if (!window.confirm(confirmMsg)) return;

        try {
            const token = sessionStorage.getItem("token");
            await axios.post(
                'http://localhost:5000/api/admin/sellers/verify',
                { sellerId: id, status }, // status: 'Approved' or 'Rejected'
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(`Seller ${status} successfully`);
            fetchSellers(); // Refresh the list
        } catch (err) {
            console.error("Error updating seller status", err);
            toast.error("Action failed. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center p-5">
                <Loader className="animate-spin text-primary me-2" /> Loading Applications...
            </div>
        );
    }

    return (
        <div className="seller-verification-wrapper p-2">
            <h3 className="mb-4 fw-bold d-flex align-items-center">
                <UserCheck className="me-2 text-primary" size={28} /> Seller Verification
            </h3>

            <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                <div className="card-header bg-white py-3 border-bottom">
                    <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold text-secondary">Pending Applications</span>
                        <span className="badge bg-warning text-dark rounded-pill px-3">
                            {sellers.length} Pending
                        </span>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">Store Details</th>
                                <th>Contact Email</th>
                                <th>Eco Certification ID</th>
                                <th className="text-end pe-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sellers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center p-5 text-muted">
                                        <div className="py-4">
                                            <p className="mb-0">No pending seller applications found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                sellers.map((s) => (
                                    <tr key={s._id}>
                                        <td className="ps-4">
                                            <div className="fw-bold text-dark">{s.storeName}</div>
                                            <small className="text-muted">ID: {s._id.slice(-6).toUpperCase()}</small>
                                        </td>
                                        <td>{s.email}</td>
                                        <td>
                                            <span className="badge bg-info-subtle text-info border border-info-subtle px-2 py-1">
                                                {s.ecoCertificationId || "N/A"}
                                            </span>
                                        </td>
                                        <td className="text-end pe-4">
                                            <div className="btn-group">
                                                <button 
                                                    onClick={() => handleVerify(s._id, 'Approved')} 
                                                    className="btn btn-sm btn-success d-flex align-items-center gap-1"
                                                >
                                                    <CheckCircle size={14} /> Approve
                                                </button>
                                                <button 
                                                    onClick={() => handleVerify(s._id, 'Rejected')} 
                                                    className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 ms-2"
                                                >
                                                    <XCircle size={14} /> Reject
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default SellerVerification;
