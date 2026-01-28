import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { LogOut, Settings } from 'lucide-react';

function AdminLayout({ children }) {
  const navigate = useNavigate();

  const AdminHeader = () => (
    <header className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top shadow-sm p-3">
      <div className="container-fluid">
        <span className="navbar-brand fw-bold text-dark">
          <i className="bi bi-shield-lock me-2 text-success"></i> Administrator Panel
        </span>

        <div className="d-flex ms-auto">
          {/* ✅ Settings button */}
          <button
            className="btn btn-outline-secondary me-3 d-flex align-items-center"
            onClick={() => navigate('/admin/settings')}
          >
            <Settings size={18} className="me-1" /> Settings
          </button>

          {/* Logout button */}
          <button
            className="btn btn-danger d-flex align-items-center"
            onClick={() => navigate('/login')}
          >
            <LogOut size={18} className="me-1" /> Logout
          </button>
        </div>
      </div>
    </header>
  );

  return (
    <div className="d-flex admin-layout-wrapper" style={{ minHeight: '100vh' }}>
      
      {/* Sidebar */}
      <div className="d-flex flex-column">
        <AdminSidebar />
      </div>

      {/* Main content area */}
      <div className="main-content-area flex-grow-1 d-flex flex-column">
        
        {/* Header */}
        <AdminHeader />

        {/* Page content */}
        <main
          className="p-4 flex-grow-1"
          style={{ backgroundColor: '#f8f9fa' }}
        >
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-light p-2 border-top text-center text-muted small">
          &copy; 2025 Eco-Marketplace Admin System
        </footer>
      </div>
    </div>
  );
}

export default AdminLayout;
