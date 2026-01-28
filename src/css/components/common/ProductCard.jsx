import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { toast } from 'react-toastify';
import { ToggleWishlistApi } from '../../../Redux/service/AllApi';

function ProductCard({ product, wishlistItems, setWishlistItems }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const isOutOfStock = (product.stock ?? product.quantity) <= 0;

  // Sync Heart color with the wishlist
  useEffect(() => {
    if (wishlistItems) {
      const exists = wishlistItems.some(item => item._id === product._id);
      setIsWishlisted(exists);
    }
  }, [product._id, wishlistItems]);

  // 🛒 Add to Cart Logic
  const handleAddToCart = (e) => {
    e.preventDefault();
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find(item => item._id === product._id);

    if (existingItem) {
      existingItem.qty += 1;
      toast.info("Quantity updated in cart");
    } else {
      cart.push({ ...product, qty: 1 });
      toast.success("Added to cart!");
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // ❤️ Wishlist Toggle Logic
  const handleWishlist = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");

    if (!token) {
      toast.warning("Please login to manage your wishlist");
      return;
    }

    const reqHeader = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };

    try {
      const result = await ToggleWishlistApi(product._id, reqHeader);
      
      if (result.status === 200) {
        if (!isWishlisted) {
          toast.success("Added to wishlist!");
          setIsWishlisted(true);
        } else {
          toast.info("Removed from wishlist");
          setIsWishlisted(false);
        }
        window.dispatchEvent(new Event("wishlistUpdated"));
      }
    } catch (err) {
      console.error("Wishlist Toggle Error", err);
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <div className="card product-card border-0 shadow-sm rounded-4 overflow-hidden position-relative h-100 transition-all bg-white">
      
      {/* Status Badges */}
      <div className="position-absolute top-0 start-0 m-3 z-3">
        {isOutOfStock ? (
          <span className="badge bg-danger px-3 py-2 rounded-pill shadow-sm">Out of Stock</span>
        ) : (
          product.isNew && <span className="badge bg-success px-3 py-2 rounded-pill shadow-sm">New Arrival</span>
        )}
      </div>

      {/* Wishlist Button */}
      <button 
        onClick={handleWishlist}
        className="btn btn-white btn-wishlist position-absolute top-0 end-0 m-3 z-3 rounded-circle shadow-sm border-0 bg-white p-2 transition"
      >
        <Heart 
          size={18} 
          style={{ 
            fill: isWishlisted ? "#dc3545" : "none", 
            color: isWishlisted ? "#dc3545" : "#6c757d" 
          }} 
        />
      </button>

      {/* Clickable Image Container */}
      <Link to={`/product/${product._id}`} className="image-container d-block overflow-hidden bg-light" style={{ height: '240px' }}>
        <img 
          src={product.image || 'https://placehold.co/400x400?text=Eco+Product'} 
          alt={product.name} 
          className="card-img-top w-100 h-100 object-fit-cover transition-img"
        />
      </Link>

      {/* Product Details */}
      <div className="card-body p-4 text-start d-flex flex-column justify-content-between">
        <div>
          <p className="text-success small fw-bold text-uppercase mb-1" style={{ fontSize: '0.7rem' }}>
            {product.category || 'Sustainable'}
          </p>
          <Link to={`/product/${product._id}`} className="text-decoration-none">
            <h6 className="card-title fw-bold text-dark mb-2 text-truncate-2" title={product.name}>
              {product.name}
            </h6>
          </Link>
        </div>
        
        {/* Price and Cart Button Section */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="d-flex flex-column">
            <span className="h5 fw-bold text-dark mb-0">₹{product.price}</span>
            {product.oldPrice && <small className="text-muted text-decoration-line-through">₹{product.oldPrice}</small>}
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="btn btn-success rounded-circle p-2 shadow-sm hover-scale border-0 d-flex align-items-center justify-content-center"
            disabled={isOutOfStock}
            title="Add to Cart"
            style={{ width: '40px', height: '40px' }}
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>

      <style>{`
        .product-card { transition: all 0.4s ease; border: 1px solid #f8f9fa !important; }
        .product-card:hover { transform: translateY(-10px); box-shadow: 0 25px 50px rgba(0,0,0,0.08) !important; }
        .transition-img { transition: transform 0.8s cubic-bezier(0.165, 0.84, 0.44, 1); }
        .product-card:hover .transition-img { transform: scale(1.1); }
        .hover-scale:hover { transform: scale(1.1); transition: 0.2s; }
        .text-truncate-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default ProductCard;