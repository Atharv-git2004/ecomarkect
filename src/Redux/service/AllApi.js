import { commonAPI } from "./commonApi";
import { BASE_URL } from "./baseUrl";

// ==========================================
// 1. AUTHENTICATION & PROFILE
// ==========================================

export const RegistrationApi = async (user) => {
    return await commonAPI("POST", `${BASE_URL}/api/users/register`, user, "");
};

export const LoginApi = async (user) => {
    return await commonAPI("POST", `${BASE_URL}/api/users/login`, user, "");
};

export const GoogleLoginApi = async (userData) => {
    return await commonAPI("POST", `${BASE_URL}/api/users/google-login`, userData, "");
};

export const GetUserProfileApi = async (header) => {
    return await commonAPI("GET", `${BASE_URL}/api/profile/me`, "", header);
};

export const UpdateUserProfileApi = async (userData, header) => {
    return await commonAPI("PUT", `${BASE_URL}/api/profile/profile`, userData, header);
};

// ==========================================
// 2. PRODUCTS MANAGEMENT
// ==========================================

export const AddProductApi = async (product, header) => {
    return await commonAPI("POST", `${BASE_URL}/api/products/add`, product, header);
};

export const GetAllProductsApi = async (searchKey = "") => {
    return await commonAPI("GET", `${BASE_URL}/api/products?search=${searchKey}`, "", "");
};

export const GetProductByIdApi = async (id) => {
    return await commonAPI("GET", `${BASE_URL}/api/products/single/${id}`, "", "");
};

export const GetSellerProductsApi = async (header) => {
    return await commonAPI("GET", `${BASE_URL}/api/products/seller/my-products`, "", header);
};

export const UpdateProductApi = async (id, productData, header) => {
    return await commonAPI("PUT", `${BASE_URL}/api/products/update/${id}`, productData, header);
};

export const DeleteProductApi = async (id, header) => {
    return await commonAPI("DELETE", `${BASE_URL}/api/products/delete/${id}`, {}, header);
};

// ==========================================
// 3. CART MANAGEMENT
// ==========================================

export const AddToCartApi = async (cartData, header) => {
    return await commonAPI("POST", `${BASE_URL}/api/cart/add`, cartData, header);
};

export const GetCartApi = async (header) => {
    return await commonAPI("GET", `${BASE_URL}/api/cart`, "", header);
};

export const UpdateCartQtyApi = async (id, qtyData, header) => {
    return await commonAPI("PATCH", `${BASE_URL}/api/cart/${id}`, qtyData, header);
};

export const RemoveFromCartApi = async (productId, header) => {
    return await commonAPI("DELETE", `${BASE_URL}/api/cart/${productId}`, {}, header);
};

// ==========================================
// 4. ORDER MANAGEMENT
// ==========================================

export const PlaceOrderApi = async (orderData, header) => {
    return await commonAPI("POST", `${BASE_URL}/api/orders`, orderData, header);
};

export const GetMyOrdersApi = async (header) => {
    return await commonAPI("GET", `${BASE_URL}/api/orders/myorders`, "", header);
};

// സെല്ലർ ഓർഡറുകളെപ്പറ്റിയുള്ള വിവരങ്ങൾ എടുക്കാൻ
export const GetSellerOrdersApi = async (header) => {
    return await commonAPI("GET", `${BASE_URL}/api/seller/orders`, "", header);
};

/**
 * ✅ ശരിയാക്കിയത്: 
 * ബാക്കെൻഡ് റൂട്ട് പ്രകാരം ഇത് /api/seller/orders/${orderId}/status എന്നാകണം.
 * കാരണം നമ്മൾ റൂട്ട് ഫയലിൽ router.put('/orders/:orderId/status',...) എന്നാണ് നൽകിയത്.
 */
export const UpdateOrderStatusApi = async (orderId, statusData, header) => {
    return await commonAPI("PUT", `${BASE_URL}/api/seller/orders/${orderId}/status`, statusData, header);
};

export const CancelOrderApi = async (orderId, header) => {
    return await commonAPI("DELETE", `${BASE_URL}/api/orders/${orderId}`, {}, header);
};

// ==========================================
// 5. SELLER & ANALYTICS
// ==========================================

export const GetSellerProfileApi = async (header) => {
    return await commonAPI("GET", `${BASE_URL}/api/seller/profile`, "", header);
};

// ✅ ശരിയാക്കിയത്: ഇരട്ട 'await' ഒഴിവാക്കി
export const UpdateSellerProfileApi = async (sellerData, header) => {
    return await commonAPI("POST", `${BASE_URL}/api/seller/profile`, sellerData, header);
};

export const GetSellerDashboardApi = async (header) => {
    return await commonAPI("GET", `${BASE_URL}/api/seller/dashboard`, "", header); 
};

export const GetSellerFinanceApi = async (header) => {
    return await commonAPI("GET", `${BASE_URL}/api/seller/finance`, "", header);
};

// ==========================================
// 6. WISHLIST & REVIEWS
// ==========================================

export const ToggleWishlistApi = async (productId, header) => {
    return await commonAPI("POST", `${BASE_URL}/api/wishlist/toggle`, { productId }, header);
};

export const GetWishlistApi = async (header) => {
    return await commonAPI("GET", `${BASE_URL}/api/wishlist`, "", header);
};

export const AddReviewApi = async (id, reviewData, header) => {
    return await commonAPI("POST", `${BASE_URL}/api/products/${id}/reviews`, reviewData, header);
};

// ==========================================
// 7. ADMIN APIs
// ==========================================

export const GetAdminStatsApi = async (header) => {
    return await commonAPI("GET", `${BASE_URL}/api/admin/stats`, "", header);
};

export const GetAllUsersAdminApi = async (header) => {
    return await commonAPI("GET", `${BASE_URL}/api/admin/users`, "", header);
};

export const BlockUserAdminApi = async (id, header) => {
    return await commonAPI("PATCH", `${BASE_URL}/api/admin/users/block/${id}`, {}, header);
};

export const GetAllOrdersAdminApi = async (header) => {
    return await commonAPI("GET", `${BASE_URL}/api/admin/orders`, "", header);
};

export const GetPendingProductsAdminApi = async (header) => {
    return await commonAPI("GET", `${BASE_URL}/api/products/admin/pending`, "", header);
};

export const VerifyProductAdminApi = async (id, statusData, header) => {
    return await commonAPI("PATCH", `${BASE_URL}/api/products/approve/${id}`, statusData, header);
};