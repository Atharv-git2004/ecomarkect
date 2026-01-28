import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Tag, Package, DollarSign, User, List, LogOut } from 'lucide-react';

function SellerSidebar() {
  const navigate = useNavigate();

  const activeStyle = { 
      backgroundColor: '#2d7a56', 
      color: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  };
  
  const navItems = [
    { to: "/seller/dashboard", icon: Home, label: "Dashboard" },
    { to: "/seller/products", icon: Tag, label: "Product Listing" },
    { to: "/seller/add-product", icon: List, label: "Add Product" }, 
    { to: "/seller/orders", icon: Package, label: "Order Management" },
    { to: "/seller/payouts", icon: DollarSign, label: "Payouts" },
    { to: "/seller/profile", icon: User, label: "Profile & Settings" }, 
  ];

  const handleLogout = () => {
    // സെഷനും ടോക്കണും പൂർണ്ണമായി ക്ലിയർ ചെയ്യുന്നു
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div 
      className="d-flex flex-column p-3 bg-success text-white border-end shadow-sm" 
      style={{ 
        width: '260px', 
        minHeight: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}
    >
      <div className="px-2 mb-4">
        <h4 className="text-white fw-bold mb-0">Seller Panel</h4>
        <small className="text-white-50 opacity-75">Eco-Friendly Business</small>
      </div>
      
      <hr className="bg-white-50 mt-0 opacity-25" />
      
      <nav className="nav nav-pills flex-column gap-2 flex-grow-1">
        {navItems.map((item, index) => (
          <NavLink 
            key={index}
            className="nav-link text-white d-flex align-items-center py-2 px-3 transition-all sidebar-link" 
            to={item.to} 
            style={({ isActive }) => isActive ? activeStyle : { borderRadius: '8px' }}
          >
            <item.icon size={18} className="me-3" /> 
            <span className="fw-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <hr className="bg-white-50 opacity-25 mt-auto" />
      
      <button 
        onClick={handleLogout}
        className="btn btn-link text-white text-decoration-none d-flex align-items-center px-3 py-2 border-0 opacity-75 hover-opacity-100"
        style={{ transition: '0.3s' }}
      >
        <LogOut size={18} className="me-3" />
        <span className="fw-medium">Logout</span>
      </button>

      <style>{`
        .sidebar-link:hover {
          background-color: rgba(255, 255, 255, 0.1);
          color: white !important;
        }
        .hover-opacity-100:hover {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}

export default SellerSidebar;