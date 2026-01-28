import React, { useState, useEffect } from 'react';
import { ShoppingBag, DollarSign, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GetSellerDashboardApi } from '../../Redux/service/AllApi';
import { toast } from 'react-toastify';

function SellerDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    orderGrowth: "+0%",
    revenueGrowth: "+0%"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const header = { Authorization: `Bearer ${token}` };
      try {
        const result = await GetSellerDashboardApi(header);
        
        // ബാക്കെൻഡ് കൺട്രോളറിൽ നിന്നുള്ള കൃത്യമായ കീ പേരുകൾ ഇവിടെ ഉപയോഗിക്കുന്നു
        if (result.status === 200) {
          setStats({
            totalOrders: result.data.totalOrders || 0,
            totalRevenue: result.data.totalRevenue || 0,
            orderGrowth: result.data.orderGrowth || "+0%",
            revenueGrowth: result.data.revenueGrowth || "+0%"
          });
        }
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
        toast.error("Failed to load dashboard statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      icon: <ShoppingBag size={24} />,
      title: "Total Orders",
      value: stats.totalOrders,
      growth: stats.orderGrowth,
      color: "#4f46e5",
      bg: "#e0e7ff",
      isPositive: stats.orderGrowth.includes('+')
    },
    {
      icon: <DollarSign size={24} />,
      title: "Total Revenue",
      value: `₹${Number(stats.totalRevenue).toLocaleString('en-IN')}`,
      growth: stats.revenueGrowth,
      color: "#16a34a",
      bg: "#dcfce7",
      isPositive: stats.revenueGrowth.includes('+')
    }
  ];

  if (loading) return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '70vh' }}>
      <div className="spinner-border text-success mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading Dashboard...</span>
      </div>
      <p className="text-muted fw-bold">Gathering your store statistics...</p>
    </div>
  );

  return (
    <div className="seller-dashboard-wrapper p-4 animate-fade-in bg-light min-vh-100 text-start">
      <div className="d-flex align-items-center gap-2 mb-4">
        <Activity className="text-success" size={28} />
        <h2 className="fw-black text-dark mb-0">Seller Dashboard Overview</h2>
      </div>

      {/* Stat Cards Section */}
      <div className="row g-4 mb-5">
        {statCards.map((stat, index) => (
          <div className="col-lg-6 col-md-6" key={index}>
            <div className="card border-0 shadow-sm h-100 transition-hover" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div style={{ backgroundColor: stat.bg, padding: '14px', borderRadius: '15px', color: stat.color }}>
                    {stat.icon}
                  </div>
                  <div className={`d-flex align-items-center gap-1 px-3 py-1 rounded-pill small fw-bold ${stat.isPositive ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                    {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {stat.growth}
                  </div>
                </div>
                <div>
                  <p className="text-muted mb-1 fw-bold text-uppercase small letter-spacing-1">{stat.title}</p>
                  <h1 className="fw-black mb-0 display-6 text-dark">{stat.value}</h1>
                  <p className="text-muted small mt-2 mb-0 d-flex align-items-center gap-1">
                    <span className="dot bg-success"></span> Updated real-time
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Title */}
      <h5 className="fw-bold mb-3 text-secondary px-1">Quick Actions</h5>
      
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <Link to="/seller/add-product" className="btn btn-success btn-lg w-100 py-3 fw-bold shadow-sm rounded-4 d-flex align-items-center justify-content-center gap-2 border-0">
            <ShoppingBag size={20} /> Add New Product
          </Link>
        </div>
        <div className="col-md-4">
          <Link to="/seller/orders" className="btn btn-dark btn-lg w-100 py-3 fw-bold shadow-sm rounded-4 d-flex align-items-center justify-content-center gap-2 border-0">
            <Activity size={20} /> View Pending Orders
          </Link>
        </div>
        <div className="col-md-4">
          <Link to="/seller/profile" className="btn btn-white btn-lg w-100 py-3 fw-bold shadow-sm rounded-4 d-flex align-items-center justify-content-center gap-2 border border-2">
             Store Settings
          </Link>
        </div>
      </div>

      <style>{`
        .fw-black { font-weight: 900; }
        .letter-spacing-1 { letter-spacing: 1px; }
        .transition-hover:hover { transform: translateY(-5px); transition: all 0.3s ease; box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }
        .bg-success-subtle { background-color: #dcfce7; }
        .bg-danger-subtle { background-color: #fee2e2; }
        .dot { height: 8px; width: 8px; border-radius: 50%; display: inline-block; }
        .animate-fade-in { animation: fadeIn 0.5s ease-in; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}

export default SellerDashboard;