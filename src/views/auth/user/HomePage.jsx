import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../../css/components/common/ProductCard';
import {
  Leaf,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
  Star,
  Loader2
} from 'lucide-react';
import { toast } from 'react-toastify';
import { GetAllProductsApi } from '../../../Redux/service/AllApi';

function HomePage() {
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribeEmail, setSubscribeEmail] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const result = await GetAllProductsApi();

        if (result?.status === 200 || result?.status === 201) {
          const products =
            result.data?.allProducts ||
            result.data?.products ||
            (Array.isArray(result.data) ? result.data : []);

          if (Array.isArray(products)) {
            setDbProducts([...products].reverse().slice(0, 8));
          }
        }
      } catch (error) {
        console.error('Home Page Product Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!subscribeEmail) {
      toast.warning('Please enter a valid email');
      return;
    }
    toast.success(`Subscribed successfully with ${subscribeEmail}`);
    setSubscribeEmail('');
  };

  return (
    <div className="bg-white min-vh-100 animate-fade-in">

      {/* ================= HERO SECTION ================= */}
      <section className="mb-5">
        <div className="row g-0 align-items-center shadow-sm" style={{ minHeight: '85vh' }}>
          <div className="col-lg-6 p-5 order-2 order-lg-1">
            <div className="d-flex align-items-center gap-2 text-success fw-bold mb-3">
              <Leaf size={18} /> 100% Sustainable Choice
            </div>

            <h1 className="display-2 fw-black mb-4">
              Nature's Best <br />
              <span className="text-success italic">Delivered To You</span>
            </h1>

            <p className="lead text-muted mb-5">
              Premium eco-friendly essentials crafted for a cleaner planet and a better you.
            </p>

            <div className="d-flex gap-3 flex-wrap">
              <Link to="/products" className="btn btn-success btn-lg rounded-pill fw-bold">
                Shop Now <ShoppingBag size={18} />
              </Link>
              <Link to="/about" className="btn btn-outline-dark btn-lg rounded-pill fw-bold">
                Our Story
              </Link>
            </div>
          </div>

          <div className="col-lg-6 order-1 order-lg-2">
            <img
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1000"
              alt="Eco Lifestyle"
              className="img-fluid hero-img"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ================= TRUST BADGES ================= */}
      <div className="container mb-5">
        <div className="row g-4">
          {[
            { icon: <Truck />, title: 'Free Shipping', desc: 'Above ₹499' },
            { icon: <ShieldCheck />, title: 'Quality Assured', desc: 'Certified Organic' },
            { icon: <RotateCcw />, title: 'Easy Returns', desc: '30 Days Policy' }
          ].map((item, i) => (
            <div className="col-md-4" key={i}>
              <div className="p-4 border rounded-4 shadow-sm d-flex gap-3 align-items-center">
                <div className="p-3 bg-success-subtle rounded-circle text-success">
                  {item.icon}
                </div>
                <div>
                  <h6 className="fw-bold mb-0">{item.title}</h6>
                  <small className="text-muted">{item.desc}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= PRODUCTS ================= */}
      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <span className="text-success fw-bold small">DISCOVER</span>
            <h2 className="fw-black">New Arrivals</h2>
          </div>
          <Link to="/products" className="text-success fw-bold text-decoration-none">
            Browse All <ArrowRight size={18} />
          </Link>
        </div>

        <div className="row g-4">
          {loading ? (
            <div className="text-center py-5 col-12">
              <Loader2 size={40} className="animate-spin text-success mb-2" />
              <p className="text-muted">Loading products...</p>
            </div>
          ) : dbProducts.length ? (
            dbProducts.map((product, index) => (
              <div className="col-sm-6 col-md-4 col-lg-3" key={product._id || index}>
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <div className="text-center py-5 col-12">
              <ShoppingBag size={40} className="text-muted mb-3" />
              <p>No products available</p>
            </div>
          )}
        </div>
      </section>

      {/* ================= NEWSLETTER ================= */}
      <section className="container my-5">
        <div
          className="p-5 text-white rounded-5 shadow-lg"
          style={{ background: 'linear-gradient(135deg,#1b5e20,#2e7d32)' }}
        >
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4">
              <div className="d-flex align-items-center gap-2 mb-2">
                <Star size={18} className="text-warning" fill="currentColor" />
                <span className="fw-bold small">ECO REVOLUTION</span>
              </div>
              <h2 className="fw-black">Save Earth, Stay Healthy</h2>
              <p className="opacity-75">Subscribe & get 15% off your first order</p>
            </div>

            <div className="col-lg-6">
              <form className="bg-white rounded-pill p-2 d-flex" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  className="form-control border-0"
                  placeholder="Enter your email"
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                  required
                />
                <button className="btn btn-dark rounded-pill fw-bold">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STYLES ================= */}
      <style>{`
        .hero-img {
          height: 85vh;
          width: 100%;
          object-fit: cover;
        }
        .fw-black { font-weight: 900; }
        .italic { font-style: italic; }
        .animate-spin { animation: spin 1s linear infinite; }
        .animate-fade-in { animation: fadeIn .6s ease-in; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @media (max-width: 992px) {
          .hero-img { height: 350px; }
        }
      `}</style>
    </div>
  );
}

export default HomePage;
