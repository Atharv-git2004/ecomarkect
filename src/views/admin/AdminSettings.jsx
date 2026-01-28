import React, { useState } from 'react';
import { User, Save, Edit2, X } from 'lucide-react';
import { toast } from 'react-toastify';

function AdminSettings() {
  // To check if the form is in edit mode
  const [isEditing, setIsEditing] = useState(false);
  
  const [adminData, setAdminData] = useState({
    name: "Admin User",
    email: "admin@ecomarket.com",
  });

  // Save changes handler
  const handleUpdate = (e) => {
    e.preventDefault();
    setIsEditing(false); // Exit edit mode after saving
    toast.success("Profile updated successfully!");
  };

  // Cancel edit mode
  const cancelEdit = () => {
    setIsEditing(false); // Discard changes and exit edit mode
  };

  return (
    <div className="admin-settings-container p-4">
      {/* Header Section */}
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h2 className="fw-bold text-dark mb-1">⚙️ Admin Settings</h2>
          <p className="text-muted mb-0">Manage your account profile and information.</p>
        </div>
        
        {/* Show Edit button only if not in editing mode */}
        {!isEditing && (
          <button 
            className="btn btn-outline-primary d-flex align-items-center gap-2 shadow-sm px-4"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 size={18} /> Edit Profile
          </button>
        )}
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '15px' }}>
            <div className="d-flex align-items-center mb-4">
              <div className="p-2 bg-primary bg-opacity-10 rounded-circle me-3">
                <User className="text-primary" size={24} />
              </div>
              <h5 className="mb-0 fw-bold">Admin Profile Information</h5>
            </div>
            
            <form onSubmit={handleUpdate}>
              {/* Full Name */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">Full Name</label>
                <input 
                  type="text" 
                  className={`form-control py-2 ${!isEditing ? 'bg-light border-0 shadow-none' : ''}`}
                  value={adminData.name}
                  onChange={(e) => setAdminData({...adminData, name: e.target.value})}
                  readOnly={!isEditing} // Cannot type unless edit mode is active
                  required
                />
              </div>
              
              {/* Email */}
              <div className="mb-4">
                <label className="form-label small fw-bold text-secondary">Email Address</label>
                <input 
                  type="email" 
                  className="form-control py-2 bg-light border-0 shadow-none" 
                  value={adminData.email}
                  readOnly 
                  disabled
                />
                <small className="text-muted">
                  Security Policy: Email can only be changed by the Super Admin.
                </small>
              </div>

              {/* Show Save and Cancel only in edit mode */}
              {isEditing && (
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-success px-4 d-flex align-items-center gap-2 shadow-sm">
                    <Save size={18} /> Save Changes
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-light px-4 d-flex align-items-center gap-2"
                    onClick={cancelEdit}
                  >
                    <X size={18} /> Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;
