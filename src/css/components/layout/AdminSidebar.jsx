import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Users,
  CheckSquare,
  Settings,
  DollarSign,
  Package,
  MessageSquare,
} from 'lucide-react';

function AdminSidebar() {
  // Active link style when a route matches
  const activeStyle = {
    backgroundColor: '#6c757d',
    color: 'white',
    borderRadius: '8px',
  };

  const navItems = [
    { to: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Users Management' },
    { to: '/admin/verification', icon: CheckSquare, label: 'Seller Verification' },
    { to: '/admin/approvals', icon: Package, label: 'Product Approvals' },
    { to: '/admin/reports', icon: DollarSign, label: 'Sales Reports' },
    { to: '/admin/complaints', icon: MessageSquare, label: 'User Complaints' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div
      className="admin-sidebar bg-dark text-white p-3 shadow-lg"
      style={{
        width: '260px',
        minHeight: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <div className="sidebar-header mb-4 px-2">
        <h4 className="fw-bold mb-0 text-white border-bottom pb-3">
          Admin Panel
        </h4>
      </div>

      <nav className="nav nav-pills flex-column gap-1">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            className="nav-link text-white d-flex align-items-center py-2 px-3 transition-all sidebar-link"
            to={item.to}
            style={({ isActive }) =>
              isActive ? activeStyle : { borderRadius: '8px' }
            }
          >
            <item.icon size={20} className="me-3" />
            <span className="fw-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <style>{`
        .sidebar-link:hover {
          background-color: rgba(255, 255, 255, 0.1);
          color: white !important;
          transform: translateX(5px);
        }
        .transition-all {
          transition: all 0.3s ease;
        }
        @media (max-width: 768px) {
          .admin-sidebar {
            width: 80px !important;
            padding: 1rem 0.5rem !important;
          }
          .admin-sidebar span,
          .sidebar-header h4 {
            display: none;
          }
          .admin-sidebar .nav-link {
            justify-content: center;
            padding: 12px !important;
          }
          .admin-sidebar .me-3 {
            margin-right: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminSidebar;
