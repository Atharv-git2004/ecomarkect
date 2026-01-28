import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Seller Pages
import SellerDashboard from './SellerDashboard';
import ProductList from './ProductList';
import AddProduct from './AddProduct';
import EditProduct from './EditProduct';
import SellerProfile from './SellerProfile';
import Payouts from './Payouts';
import SellerOrdersPage from '../../pages/SellerOrdersPage';
import Error404 from '../Error404';

// Seller Layout
import SellerLayout from '../../css/components/layout/SellerLayout';

function SellerWrapper() {
  return (
    <SellerLayout>
      <div className="seller-content p-4 w-100">
        <Outlet /> 
      </div>
    </SellerLayout>
  );
}

function SellerModule() {
  return (
    <Routes>
      <Route path="/" element={<SellerWrapper />}>
        {/* Default redirect to dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<SellerDashboard />} />

        {/* Product Management */}
        <Route path="products" element={<ProductList />} />
        
        {/* ഈ പാത്ത് ആണ് ശ്രദ്ധിക്കേണ്ടത്: /seller/add-product */}
        <Route path="add-product" element={<AddProduct />} />
        
        {/* /seller/edit-product/:id */}
        <Route path="edit-product/:id" element={<EditProduct />} />

        {/* Orders */}
        <Route path="orders" element={<SellerOrdersPage />} />

        {/* Payouts */}
        <Route path="payouts" element={<Payouts />} />

        {/* Profile */}
        <Route path="profile" element={<SellerProfile />} />

        {/* Catch-all 404 */}
        <Route path="*" element={<Error404 />} />
      </Route>
    </Routes>
  );
}

export default SellerModule;