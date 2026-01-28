import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, Plus, Minus, ArrowLeft, CreditCard } from 'lucide-react';
import { toast } from 'react-toastify';

function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    // Helper to get unique item ID
    const getId = (item) => item._id || item.id;

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(savedCart);
    }, []);

    // Listen to cart updates from other tabs
    useEffect(() => {
        const handleStorage = () => setCartItems(JSON.parse(localStorage.getItem('cart')) || []);
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    // Update cart in localStorage and notify other components
    const updateCart = (updatedCart) => {
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    // Remove an item
    const handleRemoveItem = (itemId) => {
        const updatedCart = cartItems.filter(item => getId(item) !== itemId);
        updateCart(updatedCart);
        toast.info("Item removed from cart");
    };

    // Update quantity
    const updateQty = (itemId, amount) => {
        const updatedCart = cartItems.map(item => {
            if (getId(item) === itemId) {
                const newQty = Math.max(1, (item.qty || 1) + amount);
                return { ...item, qty: newQty };
            }
            return item;
        });
        updateCart(updatedCart);
    };

    // Calculate total amount
    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => acc + ((Number(item.price) || 0) * (item.qty || 1)), 0);
    };

    // Checkout
    const handleCheckout = () => {
        if (cartItems.length === 0) return;
        sessionStorage.setItem('checkoutItems', JSON.stringify(cartItems));
        navigate('/checkout');
    };

    return (
        <div className="cart-page-wrapper bg-light min-vh-100 py-5">
            <div className="container">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-end mb-5">
                    <div className="text-start">
                        <Link to="/products" className="text-decoration-none text-muted small fw-bold d-flex align-items-center mb-2 hover-success transition">
                            <ArrowLeft size={16} className="me-1" /> CONTINUE SHOPPING
                        </Link>
                        <h1 className="fw-black mb-0 display-5">Shopping Cart</h1>
                    </div>
                    <div className="text-end d-none d-md-block">
                        <span className="text-muted fw-bold">{cartItems.length} ITEMS</span>
                    </div>
                </div>

                {cartItems.length === 0 ? (
                    <div className="text-center py-5 bg-white rounded-5 shadow-sm animate-fade-in border">
                        <ShoppingBag size={100} className="text-success mb-4 mx-auto opacity-25" />
                        <h2 className="fw-bold">Your cart is empty</h2>
                        <p className="text-muted mb-4 fs-5">Looks like you haven't added anything yet.</p>
                        <Link to="/products" className="btn btn-success btn-lg px-5 py-3 rounded-pill fw-bold shadow">
                            Explore Products
                        </Link>
                    </div>
                ) : (
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            {/* Table Header */}
                            <div className="d-none d-md-grid grid-header px-4 mb-3 text-muted small fw-bold">
                                <div>PRODUCT</div>
                                <div className="text-center">QUANTITY</div>
                                <div className="text-end">TOTAL</div>
                            </div>

                            {/* Cart Items */}
                            <div className="cart-list mb-4">
                                {cartItems.map(item => (
                                    <div key={getId(item)} className="card border-0 shadow-sm rounded-4 mb-3 overflow-hidden hover-shadow transition">
                                        <div className="card-body p-4">
                                            <div className="row align-items-center">
                                                {/* Image & Info */}
                                                <div className="col-md-6 d-flex align-items-center gap-4">
                                                    <Link to={`/product/${getId(item)}`} className="flex-shrink-0 overflow-hidden rounded-4 border shadow-sm img-hover-container">
                                                        <img 
                                                            src={item.image || item.imageUrl || 'https://placehold.co/100'} 
                                                            alt={item.name} 
                                                            className="cart-item-img transition"
                                                            style={{ width: '110px', height: '110px', objectFit: 'cover' }}
                                                        />
                                                    </Link>
                                                    <div className="text-start">
                                                        <Link to={`/product/${getId(item)}`} className="text-decoration-none">
                                                            <h5 className="fw-bold mb-1 text-dark hover-success transition">{item.name}</h5>
                                                        </Link>
                                                        <p className="text-muted small mb-2">Unit Price: ₹{item.price}</p>
                                                        <button 
                                                            onClick={() => handleRemoveItem(getId(item))}
                                                            className="btn btn-link text-danger p-0 small fw-bold text-decoration-none hover-opacity"
                                                        >
                                                            REMOVE
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="col-md-3 col-6 mt-3 mt-md-0 d-flex justify-content-md-center">
                                                    <div className="d-flex align-items-center border rounded-pill bg-white px-2 py-1 shadow-sm">
                                                        <button onClick={() => updateQty(getId(item), -1)} className="btn btn-sm border-0 rounded-circle p-2"><Minus size={14}/></button>
                                                        <span className="px-3 fw-bold fs-5">{item.qty || 1}</span>
                                                        <button onClick={() => updateQty(getId(item), 1)} className="btn btn-sm border-0 rounded-circle p-2"><Plus size={14}/></button>
                                                    </div>
                                                </div>

                                                {/* Subtotal */}
                                                <div className="col-md-3 col-6 mt-3 mt-md-0 text-end">
                                                    <h4 className="fw-black text-dark mb-0">₹{(item.price * (item.qty || 1)).toLocaleString()}</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="bg-white rounded-5 p-4 p-md-5 shadow-sm border animate-fade-in mt-5">
                                <div className="row align-items-center">
                                    <div className="col-md-6 text-start">
                                        <h3 className="fw-bold mb-1">Total Amount</h3>
                                        <p className="text-muted mb-0">Ready to complete your sustainable purchase?</p>
                                    </div>
                                    <div className="col-md-6 text-md-end mt-4 mt-md-0">
                                        <h1 className="fw-black text-success display-4 mb-3">₹{calculateTotal().toLocaleString()}</h1>
                                        <button 
                                            onClick={handleCheckout}
                                            className="btn btn-success btn-xl w-100 w-md-auto px-5 py-3 rounded-pill fw-bold shadow-lg d-flex align-items-center justify-content-center gap-2 transition hover-scale"
                                        >
                                            <CreditCard size={20} /> CHECKOUT NOW
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Styles */}
            <style>{`
                .fw-black { font-weight: 900; }
                .grid-header { display: grid; grid-template-columns: 2fr 1fr 1fr; }
                .hover-shadow:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0,0,0,0.08) !important; }
                .hover-scale:hover { transform: scale(1.03); }
                .hover-success:hover { color: #198754 !important; }
                .transition { transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1); }
                .img-hover-container:hover .cart-item-img { transform: scale(1.1); }
                .animate-fade-in { animation: fadeIn 0.6s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @media (max-width: 768px) { .btn-xl { width: 100%; } }
            `}</style>
        </div>
    );
}

export default CartPage;
