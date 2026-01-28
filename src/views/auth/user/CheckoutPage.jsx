import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MapPin, ArrowLeft, ShoppingBag } from 'lucide-react';
import { PlaceOrderApi } from '../../../Redux/service/AllApi';

function CheckoutPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [address, setAddress] = useState({ fullName: '', mobile: '', pincode: '', house: '', city: '' });

    // Utility to get quantity
    const getQty = (item) => Number(item.quantity || item.qty || 1);

    // Load checkout data
    useEffect(() => {
        const token = sessionStorage.getItem("token") || localStorage.getItem("token");
        if (!token) {
            toast.warning("Please login first.");
            navigate('/login');
            return;
        }

        const type = new URLSearchParams(location.search).get('type');
        const data = type === 'direct' ? sessionStorage.getItem('direct_buy') : sessionStorage.getItem('cart');
        const items = data ? JSON.parse(data) : [];

        if (!items.length) {
            toast.error("Cart is empty.");
            navigate('/');
            return;
        }

        setCartItems(items);
        const totalPrice = items.reduce((acc, item) => acc + (Number(item.price) * getQty(item)), 0);
        setTotal(totalPrice);

        console.log("Checkout Items:", items); // for debugging
    }, [location.search, navigate]);

    const handleLogout = () => {
        sessionStorage.clear();
        localStorage.clear();
        navigate('/login');
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem("token") || localStorage.getItem("token");
        if (!token) return handleLogout();

        const header = { "Content-Type": "application/json", "Authorization": `Bearer ${token}` };

        // Prepare order data
        const orderData = {
            orderItems: cartItems.map(item => ({
                name: item.name,
                qty: getQty(item),
                image: item.imageUrl || item.image,
                price: Number(item.price),
                product: item._id || item.product,
                sellerId: item.sellerId
            })),
            shippingAddress: {
                name: address.fullName,
                phone: address.mobile,
                house: address.house,
                city: address.city,
                pincode: address.pincode
            },
            paymentMethod: "COD",
            totalPrice: total
        };

        // Validate sellerId
        if (orderData.orderItems.some(item => !item.sellerId)) {
            toast.error("Some products are missing seller info. Please refresh the cart.");
            return;
        }

        try {
            const result = await PlaceOrderApi(orderData, header);
            if (result && (result.status === 201 || result.status === 200)) {
                toast.success("Order placed successfully!");
                sessionStorage.removeItem('cart');
                sessionStorage.removeItem('direct_buy');
                navigate('/my-orders');
            }
        } catch (err) {
            console.error("Checkout Error:", err);
            if (err.response?.status === 403) {
                toast.error(err.response.data?.message || "Account is blocked!");
                handleLogout();
            } else {
                toast.error("Failed to place order. Try again later.");
            }
        }
    };

    return (
        <div className="container py-5 text-start" style={{ minHeight: '90vh' }}>
            <button 
                onClick={() => navigate(-1)} 
                className="btn btn-outline-success btn-sm rounded-pill mb-4 px-3 d-flex align-items-center gap-1"
            >
                <ArrowLeft size={18} /> Go Back
            </button>

            <div className="row g-4">
                {/* Shipping Form */}
                <div className="col-md-7">
                    <div className="card border-0 shadow-sm rounded-4 p-4">
                        <h5 className="fw-bold text-success mb-4 d-flex align-items-center gap-2">
                            <MapPin size={22} /> Shipping Information
                        </h5>
                        <form onSubmit={handlePlaceOrder}>
                            <div className="row g-3">
                                {[
                                    { label: "Full Name", key: "fullName", type: "text", placeholder: "Ex: Rahul P.V" },
                                    { label: "Phone Number", key: "mobile", type: "number", placeholder: "10-digit number" },
                                    { label: "Pincode", key: "pincode", type: "number", placeholder: "6-digit code" },
                                    { label: "City/Town", key: "city", type: "text", placeholder: "Ex: Kochi" },
                                ].map((field, i) => (
                                    <div key={i} className={field.key === "fullName" || field.key === "city" ? "col-12" : "col-md-6"}>
                                        <label className="small fw-bold text-muted">{field.label}</label>
                                        <input 
                                            type={field.type} 
                                            className="form-control" 
                                            placeholder={field.placeholder} 
                                            required
                                            onChange={e => setAddress({...address, [field.key]: e.target.value})} 
                                        />
                                    </div>
                                ))}
                                <div className="col-12">
                                    <label className="small fw-bold text-muted">House / Address</label>
                                    <textarea 
                                        className="form-control" 
                                        rows="3" 
                                        placeholder="House name, Landmark" 
                                        required
                                        onChange={e => setAddress({...address, house: e.target.value})}
                                    ></textarea>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-success w-100 mt-4 py-2 fw-bold rounded-3 shadow-sm border-0">
                                Confirm Order (₹{total.toLocaleString()})
                            </button>
                        </form>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="col-md-5">
                    <div className="card border-0 shadow-sm rounded-4 p-4 bg-light">
                        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                            <ShoppingBag size={20} /> Order Summary
                        </h5>
                        <hr />
                        <div className="overflow-auto" style={{ maxHeight: '350px' }}>
                            {cartItems.map((item, i) => (
                                <div key={i} className="d-flex justify-content-between align-items-center mb-3 pe-2">
                                    <div className="d-flex align-items-center gap-3">
                                        <img 
                                            src={item.imageUrl || item.image} 
                                            alt={item.name} 
                                            className="rounded shadow-sm"
                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                                        />
                                        <div>
                                            <p className="small fw-bold mb-0 text-truncate" style={{ maxWidth: '150px' }}>{item.name}</p>
                                            <small className="text-muted">Qty: {getQty(item)}</small>
                                        </div>
                                    </div>
                                    <span className="small fw-bold text-success">
                                        ₹{(Number(item.price) * getQty(item)).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <h5 className="fw-bold">Total</h5>
                            <h5 className="fw-bold text-success fs-4">₹{total.toLocaleString()}</h5>
                        </div>
                        <div className="mt-4 p-3 bg-white rounded-3 text-center border border-success border-dashed shadow-sm">
                            <p className="fw-bold text-success text-uppercase mb-0 small">Payment Method: Cash on Delivery</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;
