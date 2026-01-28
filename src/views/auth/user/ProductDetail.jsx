import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, ShieldCheck, Truck, Zap } from 'lucide-react';
import { GetProductByIdApi } from '../../../Redux/service/AllApi';
import { toast } from 'react-toastify';

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchProductDetails();
    }, [id]);

    const fetchProductDetails = async () => {
        try {
            setLoading(true);
            const res = await GetProductByIdApi(id); 
            if (res.status === 200) {
                setProduct(res.data);
            } else {
                toast.error("Product not found!");
            }
        } catch (err) { 
            console.error("Fetch Error:", err);
            toast.error("Error loading product details");
        } finally { 
            setLoading(false); 
        }
    };

    const handleBuyNow = () => {
        if (!product) return;
        const sId = product.sellerId || product.user || product.userId;
        const directItem = {
            _id: product._id,
            name: product.name,
            price: Number(product.price),
            quantity: 1,
            image: product.imageUrl || product.image,
            sellerId: sId 
        };
        sessionStorage.setItem('direct_buy', JSON.stringify([directItem]));
        navigate('/checkout?type=direct');
    };

    const handleAddToCart = () => {
        if (!product) return;
        let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
        const isExist = cart.find(item => item._id === product._id);

        if (!isExist) {
            cart.push({
                _id: product._id,
                name: product.name,
                price: Number(product.price),
                quantity: 1,
                image: product.imageUrl || product.image,
                sellerId: product.sellerId || product.user || product.userId
            });
            sessionStorage.setItem('cart', JSON.stringify(cart));
            window.dispatchEvent(new Event("storage"));
            toast.success("Added to Cart! 🛒");
        } else {
            toast.warn("Item already in cart");
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{height: '80vh'}}>
            <div className="spinner-border text-success" role="status"></div>
        </div>
    );

    if (!product) return <div className="text-center py-5">Product not found!</div>;

    return (
        <div className="container py-5 text-start">
            <button onClick={() => navigate(-1)} className="btn btn-link text-success mb-4 p-0 text-decoration-none d-flex align-items-center fw-bold shadow-none">
                <ArrowLeft size={20} className="me-2" /> Back to Shop
            </button>

            <div className="row g-5">
                {/* Product Image */}
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden p-2 bg-white">
                        <img 
                            src={product.imageUrl || product.image} 
                            className="img-fluid rounded-4 shadow-sm" 
                            alt={product.name}
                            style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }}
                            onError={(e) => e.target.src = "https://via.placeholder.com/500x500?text=No+Image"}
                        />
                    </div>
                </div>

                {/* Product Info */}
                <div className="col-md-6">
                    <span className="badge bg-success-subtle text-success mb-2 px-3 py-2 rounded-pill fw-bold">
                        {product.category}
                    </span>
                    <h1 className="fw-bold mb-2 text-dark">{product.name}</h1>
                    <div className="d-flex align-items-center gap-2 mb-4">
                        <h2 className="text-success fw-bold mb-0">₹{product.price}</h2>
                    </div>
                    
                    <p className="text-muted mb-4 fs-5" style={{lineHeight: '1.6'}}>
                        {product.description}
                    </p>

                    {/* Badges */}
                    <div className="row g-3 mb-4 text-start">
                        <div className="col-6">
                            <div className="p-3 border rounded-4 bg-light shadow-sm d-flex align-items-center gap-2">
                                <ShieldCheck className="text-success" size={24} />
                                <span className="small fw-bold">Eco Verified</span>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="p-3 border rounded-4 bg-light shadow-sm d-flex align-items-center gap-2">
                                <Truck className="text-success" size={24} />
                                <span className="small fw-bold">Fast Delivery</span>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="d-grid gap-3 d-md-flex mt-5">
                        <button onClick={handleAddToCart} className="btn btn-outline-success btn-lg px-4 py-3 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2 flex-grow-1 shadow-sm">
                            <ShoppingCart size={20} /> Add to Cart
                        </button>
                        <button onClick={handleBuyNow} className="btn btn-success btn-lg px-4 py-3 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2 flex-grow-1 shadow">
                            <Zap size={20} fill="white" /> Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
