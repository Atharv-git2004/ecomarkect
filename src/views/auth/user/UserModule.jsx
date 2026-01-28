import React from 'react';
import { Routes, Route } from 'react-router-dom';

// 1. Import layout
// Make sure the path matches your folder structure
import UserLayout from '../../../css/components/layout/UserLayout.jsx';

// 2. Import main pages
import HomePage from './HomePage.jsx'; 
import ProductListing from './ProductListing.jsx'; 
import ProductDetail from './ProductDetail.jsx';
import CartPage from './CartPage.jsx';
import CheckoutPage from './CheckoutPage.jsx';
import WishlistPage from './WishlistPage.jsx';
import OrderSuccessPage from '../../../pages/OrderSuccessPage.jsx';
import MyOrdersPage from '../../../pages/MyOrdersPage.jsx';
import Error404 from '../../Error404.jsx'; 

// 3. Import account section pages
import OrderHistory from './account/OrderHistory.jsx';
import TrackOrder from './account/TrackOrder.jsx';
import ReturnsAndRefunds from './account/ReturnsAndRefunds.jsx';

// 4. Import common pages
import About from '../../../css/components/common/About.jsx';

// 5. Import the new complaints page
import Complaints from './Complaints.jsx'; 

/**
 * UserModule - All routes for customers
 * are organized inside UserLayout.
 */
function UserModule() {
  return (
    <UserLayout>
      <div className="user-content flex-grow-1" style={{ minHeight: '80vh' }}>
        <Routes>
          {/* --- Home Page (Default Route) --- */}
          <Route index element={<HomePage />} />
          
          {/* --- Products --- */}
          <Route path="products" element={<ProductListing />} /> 
          <Route path="product/:id" element={<ProductDetail />} />
          
          {/* --- Common Info Pages --- */}
          <Route path="about" element={<About />} />

          {/* --- Shopping & Checkout --- */}
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="order-success" element={<OrderSuccessPage />} />

          {/* --- Account & Order Management --- */}
          <Route path="my-orders" element={<MyOrdersPage />} /> 
          
          {/* --- Nested Account Routes --- */}
          {/* URLs in browser will appear like /user/account/orders */}
          <Route path="account">
            <Route path="orders" element={<OrderHistory />} />
            <Route path="track/:orderId" element={<TrackOrder />} />
            <Route path="returns" element={<ReturnsAndRefunds />} />
          </Route>

          {/* --- Route for submitting complaints --- */}
          <Route path="complaints" element={<Complaints />} />
          
          {/* --- 404 Error Page --- */}
          {/* Any route not listed above will show this page */}
          <Route path="*" element={<Error404 />} />
        </Routes>
      </div>
    </UserLayout>
  );
}

export default UserModule;
