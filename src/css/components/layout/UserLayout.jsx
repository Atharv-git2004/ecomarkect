import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  ShoppingCart, User, Leaf, Heart, LogOut, Package, 
  Instagram, Twitter, Facebook, Mail, MapPin, Menu, X, MessageSquare 
} from "lucide-react";

function UserHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [wishCount, setWishCount] = useState(0);
  const [userData, setUserData] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const updateStoreData = () => {
    try {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const cCount = Array.isArray(savedCart) 
        ? savedCart.reduce((total, item) => total + (Number(item.qty || item.quantity) || 1), 0) 
        : 0;
      setCartCount(cCount);

      const savedWish = JSON.parse(localStorage.getItem("wishlist")) || [];
      setWishCount(Array.isArray(savedWish) ? savedWish.length : 0);

      // സെഷനിൽ നിന്ന് യൂസർ വിവരങ്ങൾ എടുക്കുന്നു
      const user = JSON.parse(sessionStorage.getItem("user"));
      setUserData(user);
    } catch (error) {
      console.error("Header sync error:", error);
    }
  };

  useEffect(() => {
    updateStoreData();
    window.addEventListener("storage", updateStoreData);
    window.addEventListener("cartUpdated", updateStoreData);
    window.addEventListener("wishlistUpdated", updateStoreData);
    return () => {
      window.removeEventListener("storage", updateStoreData);
      window.removeEventListener("cartUpdated", updateStoreData);
      window.removeEventListener("wishlistUpdated", updateStoreData);
    };
  }, []);

  useEffect(() => { setIsMobileMenuOpen(false); }, [location]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      sessionStorage.clear();
      setUserData(null);
      navigate("/");
      window.location.reload(); 
    }
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top bg-white shadow-sm py-2 main-nav">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center fw-black fs-3" to="/" style={{ letterSpacing: '-1.5px' }}>
          <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-2 shadow-sm brand-icon">
            <Leaf size={22} fill="currentColor" />
          </div>
          <span className="text-dark">Eco</span>
          <span className="text-success">Market</span>
        </Link>

        <button className="navbar-toggler border-0 shadow-none" type="button" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} className="text-dark" /> : <Menu size={28} className="text-dark" />}
        </button>

        <div className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 fw-bold text-uppercase" style={{ fontSize: '13px' }}>
            <li className="nav-item"><Link className={`nav-link px-3 ${location.pathname === '/products' ? 'text-success' : ''}`} to="/products">Shop</Link></li>
            <li className="nav-item"><Link className={`nav-link px-3 ${location.pathname === '/about' ? 'text-success' : ''}`} to="/about">Our Story</Link></li>
            <li className="nav-item"><Link className={`nav-link px-3 ${location.pathname === '/complaints' ? 'text-success' : ''}`} to="/complaints">Complaints</Link></li>
          </ul>

          <div className="d-flex align-items-center gap-2 gap-md-3">
            <Link to="/wishlist" className="nav-icon-btn position-relative" title="Wishlist">
              <Heart size={22} className={wishCount > 0 ? "text-danger" : ""} fill={wishCount > 0 ? "#dc3545" : "none"} />
              {wishCount > 0 && <span className="count-badge bg-danger animate-bounce">{wishCount}</span>}
            </Link>

            <Link to="/cart" className="nav-icon-btn position-relative" title="Cart">
              <ShoppingCart size={22} />
              {cartCount > 0 && <span className="count-badge bg-success">{cartCount}</span>}
            </Link>

            <div className="vr mx-2 d-none d-md-block opacity-10" style={{ height: '20px' }}></div>

            {userData ? (
              <div className="dropdown">
                <button className="user-profile-btn dropdown-toggle border-0 shadow-sm p-1 pe-3" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {/* ✅ UPDATE: ഗൂഗിൾ ചിത്രം ഉണ്ടോ എന്ന് പരിശോധിക്കുന്നു. 
                      ചിത്രം ലോഡ് ആകാൻ referrerPolicy ചേർത്തിട്ടുണ്ട്. */}
                  {userData.picture ? (
                    <img 
                      src={userData.picture} 
                      alt="profile" 
                      className="rounded-circle shadow-sm" 
                      referrerPolicy="no-referrer"
                      style={{ width: '32px', height: '32px', objectFit: 'cover', border: '2px solid #10b981' }} 
                    />
                  ) : (
                    <div className="avatar shadow-sm">{userData.userName?.charAt(0).toUpperCase()}</div>
                  )}
                  <span className="d-none d-md-inline ms-2 small fw-bold text-white">Hi, {userData.userName?.split(' ')[0]}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg p-2 mt-2 rounded-4 animate-slide-in">
                  <li>
                    <Link className="dropdown-item rounded-3 py-2 fw-medium" to="/my-orders">
                      <Package size={16} className="me-2" /> My Orders
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item rounded-3 py-2 fw-medium" to="/complaints">
                      <MessageSquare size={16} className="me-2" /> File a Complaint
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider opacity-50" /></li>
                  <li>
                    <button className="dropdown-item text-danger rounded-3 py-2 d-flex align-items-center gap-2 fw-bold" onClick={handleLogout}>
                      <LogOut size={16} /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="login-pill shadow-sm">
                <User size={18} /> <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

const UserFooter = () => (
  <footer className="footer-section bg-dark text-white pt-5 mt-auto" style={{ borderRadius: '40px 40px 0 0' }}>
    <div className="container">
      <div className="row g-5 pb-5">
        <div className="col-lg-4 col-md-6">
          <h4 className="fw-bold text-white mb-4 d-flex align-items-center">
            <Leaf size={28} className="text-success me-2" /> EcoMarket
          </h4>
          <p className="text-secondary mb-4 lh-lg" style={{ fontSize: '15px' }}>
            Kerala's pioneer in ethical commerce. Join us in our journey towards a zero-waste lifestyle.
          </p>
          <div className="d-flex gap-3">
            {[Instagram, Twitter, Facebook].map((Icon, i) => (
              <a key={i} href="#" className="social-link shadow-sm"><Icon size={18} /></a>
            ))}
          </div>
        </div>

        <div className="col-lg-2 col-md-3 col-6">
          <h6 className="text-white fw-bold mb-4 small text-uppercase tracking-wider">Quick Shop</h6>
          <ul className="list-unstyled footer-links">
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/about">Our Story</Link></li>
          </ul>
        </div>

        <div className="col-lg-2 col-md-3 col-6">
          <h6 className="text-white fw-bold mb-4 small text-uppercase tracking-wider">Support</h6>
          <ul className="list-unstyled footer-links">
            <li><Link to="/my-orders">Track Orders</Link></li>
            <li><Link to="/complaints">File a Complaint</Link></li>
          </ul>
        </div>

        <div className="col-lg-4 col-md-12">
          <h6 className="text-white fw-bold mb-4 small text-uppercase tracking-wider">Stay Connected</h6>
          <div className="contact-info small text-secondary mt-3">
              <div className="d-flex align-items-center gap-2 mb-2"><Mail size={14} className="text-success" /> hello@ecomarket.in</div>
              <div className="d-flex align-items-center gap-2"><MapPin size={14} className="text-success" /> Kozhikode, Kerala</div>
          </div>
        </div>
      </div>

      <div className="border-top border-secondary border-opacity-25 py-4 text-center">
        <p className="text-secondary small mb-0">© 2026 EcoMarket. Made with 💚 in Kerala.</p>
      </div>
    </div>
  </footer>
);

function UserLayout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#fdfdfd' }}>
      <UserHeader />
      <main className="flex-grow-1">{children}</main>
      <UserFooter />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .fw-black { font-weight: 900; }
        .brand-icon { width: 40px; height: 40px; background: linear-gradient(135deg, #065f46 0%, #10b981 100%); }
        .nav-link { transition: 0.3s; color: #334155; text-decoration: none; }
        .nav-link:hover { color: #10b981 !important; }
        .nav-icon-btn {
          width: 42px; height: 42px; display: flex; align-items: center; justify-content: center;
          border-radius: 50%; color: #475569; position: relative; transition: 0.3s; text-decoration: none;
        }
        .nav-icon-btn:hover { background: #f1f5f9; color: #10b981; transform: translateY(-2px); }
        .count-badge {
          position: absolute; top: 4px; right: 4px; font-size: 9px; font-weight: 800;
          color: white; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center;
          border-radius: 50%; border: 2px solid white;
        }
        .user-profile-btn {
          background: #1e293b; color: white; border-radius: 50px;
          display: flex; align-items: center; transition: 0.3s;
        }
        .user-profile-btn:hover { background: #0f172a; }
        .user-profile-btn .avatar {
          width: 32px; height: 32px; background: #10b981; color: white; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: bold;
        }
        .login-pill {
          background: #10b981; color: white; padding: 8px 20px; border-radius: 50px;
          text-decoration: none; font-weight: bold; display: flex; align-items: center; gap: 8px; transition: 0.3s;
        }
        .login-pill:hover { background: #059669; transform: scale(1.03); color: white; }
        .dropdown-item:active { background-color: #10b981; }
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .social-link { 
          width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.05); border-radius: 10px; color: #94a3b8; text-decoration: none; transition: 0.3s; 
        }
        .social-link:hover { background: #10b981; color: white; transform: translateY(-3px); }
        .footer-links li { margin-bottom: 12px; }
        .footer-links a { color: #94a3b8; text-decoration: none; font-size: 14px; transition: 0.2s; }
        .footer-links a:hover { color: #10b981; padding-left: 8px; }
        .animate-bounce { animation: bounce 2s infinite; }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
          40% {transform: translateY(-4px);}
          60% {transform: translateY(-2px);}
        }
      `}</style>
    </div>
  );
}

export default UserLayout;