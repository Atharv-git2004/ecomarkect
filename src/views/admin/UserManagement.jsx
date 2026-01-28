import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { GetAllUsersAdminApi } from '../../Redux/service/AllApi';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all users for admin view
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = sessionStorage.getItem("token") || localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            const result = await GetAllUsersAdminApi(headers);

            if (result.status === 200) {
                setUsers(result.data);
            } else {
                toast.error("Failed to fetch users");
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            toast.error("Error loading users list");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="container-fluid py-4">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">

                {/* Header */}
                <div className="card-header bg-white border-0 p-4 d-flex justify-content-between align-items-center">
                    <div>
                        <h3 className="fw-bold text-dark mb-1">User Directory</h3>
                        <p className="text-muted mb-0 small">Overview of all registered members and their platform roles.</p>
                    </div>
                    <div className="bg-success-subtle border border-success-subtle px-4 py-2 rounded-pill">
                        <span className="text-success fw-bold small">Total Records: {users.length}</span>
                    </div>
                </div>

                {/* Table */}
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0 align-middle">
                            <thead className="bg-light">
                                <tr>
                                    <th className="ps-4 py-3 text-uppercase small fw-bold text-muted">User Profile</th>
                                    <th className="py-3 text-uppercase small fw-bold text-muted">Account Email</th>
                                    <th className="py-3 text-uppercase small fw-bold text-muted">Access Level</th>
                                    <th className="py-3 text-uppercase small fw-bold text-muted text-center">Current Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-5">
                                            <div className="spinner-grow text-success" role="status"></div>
                                            <div className="mt-2 text-muted small">Loading Secure Data...</div>
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-5 text-muted">No user records found.</td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user._id} className="border-bottom border-light-subtle">
                                            {/* User Profile */}
                                            <td className="ps-4 py-3">
                                                <div className="d-flex align-items-center">
                                                    <div
                                                        className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center shadow-sm"
                                                        style={{ width: '38px', height: '38px', fontSize: '14px' }}
                                                    >
                                                        {user.userName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="ms-3">
                                                        <div className="fw-bold text-dark text-capitalize">{user.userName}</div>
                                                        <div className="text-muted" style={{ fontSize: '12px' }}>ID: {user._id.substring(0, 8)}...</div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Email */}
                                            <td className="py-3 text-muted small">{user.email}</td>

                                            {/* Role Badge */}
                                            <td className="py-3">
                                                <span className={`badge rounded-pill px-3 py-2 ${
                                                    user.role === 'Admin' ? 'bg-danger text-white' :
                                                    user.role === 'Seller' ? 'bg-warning text-dark' :
                                                    'bg-primary-subtle text-primary'
                                                }`} style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                                                    {user.role.toUpperCase()}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="py-3 text-center">
                                                {user.isActive ? (
                                                    <div className="d-inline-flex align-items-center bg-success-subtle text-success px-3 py-1 rounded-pill border border-success-subtle">
                                                        <span className="bg-success rounded-circle me-2" style={{ width: '8px', height: '8px', display: 'inline-block' }}></span>
                                                        <span className="small fw-bold">ACTIVE</span>
                                                    </div>
                                                ) : (
                                                    <div className="d-inline-flex align-items-center bg-danger-subtle text-danger px-3 py-1 rounded-pill border border-danger-subtle">
                                                        <span className="bg-danger rounded-circle me-2" style={{ width: '8px', height: '8px', display: 'inline-block' }}></span>
                                                        <span className="small fw-bold">BLOCKED</span>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                <div className="card-footer bg-light border-0 p-3 text-center">
                    <span className="text-muted small">Data synchronized with Cloud MongoDB Cluster</span>
                </div>
            </div>
        </div>
    );
}

export default UserManagement;
