import React, { useState, useEffect } from "react";
import { MessageSquare, Trash2, Eye, User, Mail, ShieldAlert } from "lucide-react";
import { toast } from "react-toastify";

function AdminComplaintsView() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // 1. Fetch complaints when the page loads
  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/complaints/all");
      const data = await response.json();
      
      if (data.success) {
        setComplaints(data.complaints);
      } else {
        toast.error(data.message || "Failed to fetch complaints");
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
      toast.error("Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  // 2. Delete a complaint
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this complaint?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/complaints/delete/${id}`, { 
            method: 'DELETE' 
        });
        const data = await response.json();
        
        if (data.success) {
          setComplaints(complaints.filter(c => c._id !== id));
          toast.success("Complaint deleted successfully");
        } else {
          toast.error("Failed to delete complaint on server");
        }
      } catch (error) {
        toast.error("Delete request failed");
      }
    }
  };

  return (
    <div className="container-fluid py-4">
      {/* Header Section */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div className="d-flex align-items-center gap-3">
          <div className="bg-success text-white p-3 rounded-4 shadow-sm">
            <MessageSquare size={24} />
          </div>
          <div>
            <h3 className="fw-bold mb-0">User Complaints</h3>
            <p className="text-muted mb-0 small">Review and manage customer feedback</p>
          </div>
        </div>
        <button className="btn btn-outline-success btn-sm rounded-pill px-3" onClick={fetchComplaints}>
          Refresh List
        </button>
      </div>

      {/* Table Section */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr className="text-secondary small text-uppercase fw-bold">
                <th className="px-4 py-3 border-0">User Details</th>
                <th className="py-3 border-0">Category</th>
                <th className="py-3 border-0">Submitted On</th>
                <th className="py-3 text-end px-4 border-0">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-5">
                    <div className="spinner-border text-success" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : complaints.length > 0 ? (
                complaints.map((item) => (
                  <tr key={item._id} className="border-bottom">
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="avatar-sm bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{width: '40px', height: '40px'}}>
                          {item.userName ? item.userName[0].toUpperCase() : "U"}
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{item.userName}</div>
                          <div className="small text-muted d-flex align-items-center gap-1">
                            <Mail size={12} /> {item.userEmail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-light text-success border border-success-subtle px-3 py-2 rounded-pill fw-medium">
                        {item.subject}
                      </span>
                    </td>
                    <td className="text-muted small">
                      {new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="text-end px-4">
                      <div className="d-flex justify-content-end gap-2">
                        <button 
                          className="btn btn-success-subtle text-success btn-sm rounded-3 px-2 border-0"
                          data-bs-toggle="modal" 
                          data-bs-target="#complaintModal"
                          onClick={() => setSelectedComplaint(item)}
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          className="btn btn-danger-subtle text-danger btn-sm rounded-3 px-2 border-0"
                          onClick={() => handleDelete(item._id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-5">
                    <div className="text-muted d-flex flex-column align-items-center">
                      <ShieldAlert size={40} className="mb-2 opacity-50" />
                      <p>No complaints found in the database.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Section */}
      <div className="modal fade" id="complaintModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header border-bottom-0 pb-0">
              <h5 className="fw-bold d-flex align-items-center gap-2">
                <MessageSquare className="text-success" size={20} /> Details
              </h5>
              <button type="button" className="btn-close shadow-none" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body p-4">
              {selectedComplaint && (
                <div className="d-flex flex-column gap-3">
                  <div className="p-3 bg-light rounded-3">
                    <div className="fw-bold text-dark"><User size={16} /> {selectedComplaint.userName}</div>
                    <div className="small text-muted"><Mail size={14} /> {selectedComplaint.userEmail}</div>
                  </div>
                  <div>
                    <div className="small text-muted fw-bold">SUBJECT:</div>
                    <div className="text-success fw-bold">{selectedComplaint.subject}</div>
                  </div>
                  <div className="p-3 bg-success-subtle rounded-3 border-start border-4 border-success">
                    <p className="mb-0 text-dark">{selectedComplaint.message}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .bg-success-subtle { background-color: #e8f5e9 !important; }
        .text-success { color: #2e7d32 !important; }
        .btn-success-subtle { background-color: #f0fdf4; border: none; }
        .btn-danger-subtle { background-color: #fef2f2; border: none; }
      `}</style>
    </div>
  );
}

export default AdminComplaintsView;
