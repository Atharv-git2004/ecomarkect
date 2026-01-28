// src/views/admin/AdminModule.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importing all admin pages
import AdminDashboard from './AdminDashboard';
import UserManagement from './UserManagement';
import SellerVerification from './SellerVerification';
import ProductApprovals from './ProductApprovals';
import SalesReports from './SalesReports';
import AdminSettings from './AdminSettings';

// Importing the new page to view user complaints
import AdminComplaintsView from './AdminComplaintsView';

// Admin layout wrapper
import AdminLayout from '../../css/components/layout/AdminLayout';
import Error404 from '../Error404';

/**
 * AdminModule - Defines all admin panel routes
 * All routes are wrapped inside AdminLayout
 */
function AdminModule() {
  return (
    <AdminLayout>
      <div className="admin-content w-100 p-2 p-md-4">
        <Routes>

          {/* 1. Dashboard */}
          <Route path="/" element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />

          {/* 2. User & Seller Management */}
          <Route path="users" element={<UserManagement />} />
          <Route path="verification" element={<SellerVerification />} />

          {/* 3. Product approvals & Sales reports */}
          <Route path="approvals" element={<ProductApprovals />} />
          <Route path="reports" element={<SalesReports />} />

          {/* 4. Complaints management */}
          <Route path="complaints" element={<AdminComplaintsView />} />

          {/* 5. Admin settings */}
          <Route path="settings" element={<AdminSettings />} />

          {/* 6. Catch-all: show 404 for unmatched routes */}
          <Route path="*" element={<Error404 />} />

        </Routes>
      </div>
    </AdminLayout>
  );
}

export default AdminModule;
