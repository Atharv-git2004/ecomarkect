import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Store } from 'lucide-react'; // 'Shop' എന്നതിന് പകരം 'Store' ഉപയോഗിച്ചു
import SellerSidebar from './SellerSidebar'; 

function SellerLayout({ children }) {
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    sessionStorage.clear(); // സെഷൻ ക്ലിയർ ചെയ്യുന്നു
    navigate('/login');
  };

  // Seller Header Component
  const SellerHeader = () => (
    <header className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm p-3 border-bottom border-secondary">
      <div className="container-fluid">
        <span className="navbar-brand fw-bold text-success d-flex align-items-center">
          {/* Logo സെക്ഷനിൽ Store ഐക്കൺ നൽകി */}
          <Store size={24} className="me-2 text-success" />
          <span className="bg-success text-white px-2 py-1 rounded me-1">Eco</span> Portal
        </span>
        
        <div className="d-flex ms-auto align-items-center gap-3">
            {/* User Info */}
            <span className="text-white-50 small d-none d-md-block">Welcome, Seller</span>
            
            {/* Logout Button */}
            <button 
                className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2 px-3 shadow-none" 
                onClick={handleLogout}
            >
                <LogOut size={16} />
                Logout
            </button>
        </div>
      </div>
    </header>
  );

  return (
    <div className="d-flex" style={{ minHeight: '100vh', width: '100%' }}>
      
      {/* 1. Fixed Sidebar Area */}
      <aside style={{ position: 'sticky', top: 0, height: '100vh', zIndex: 1050 }}>
          <SellerSidebar />
      </aside>

      {/* 2. Scrollable Content Area */}
      <div className="flex-grow-1 d-flex flex-column bg-light" style={{ overflowX: 'hidden' }}>
        
        {/* Top Navigation */}
        <SellerHeader />

        {/* Dynamic Page Content */}
        <main className="flex-grow-1">
          <div className="container-fluid py-4 px-md-4">
              {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white p-3 border-top text-center text-muted mt-auto">
            <small>&copy; {new Date().getFullYear()} Eco-Marketplace Seller Panel. Sustainable Business, Better Future.</small>
        </footer>

      </div>
    </div>
  );
}

export default SellerLayout;