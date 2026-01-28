import React, { useEffect, useState } from 'react';
import { Users, Store, Package, DollarSign } from 'lucide-react';
import { GetAdminStatsApi } from '../../Redux/service/AllApi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function AdminDashboard() {
    // -------------------------
    // 1. State
    // -------------------------
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalSellers: 0,
        totalOrders: 0,
        totalRevenue: 0, // ബാക്കെൻഡിൽ നിന്ന് വരുന്ന വാല്യൂ
        salesTrend: [
            { name: 'Jan', value: 4000 },
            { name: 'Feb', value: 3000 },
            { name: 'Mar', value: 2000 },
            { name: 'Apr', value: 2780 },
            { name: 'May', value: 1890 },
            { name: 'Jun', value: 2390 },
            { name: 'Jul', value: 3490 },
        ]
    });
    const [loading, setLoading] = useState(true);

    // -------------------------
    // 2. Fetch dashboard data
    // -------------------------
    const fetchDashboardData = async () => {
        try {
            const token = sessionStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            }
            const header = { "Authorization": `Bearer ${token}` };
            const result = await GetAdminStatsApi(header);

            if (result.status === 200) {
                // ബാക്കെൻഡിൽ നിന്ന് കിട്ടുന്ന ഡാറ്റ സ്റ്റേറ്റിലേക്ക് സെറ്റ് ചെയ്യുന്നു
                setStats(prev => ({
                    ...prev,
                    ...result.data
                }));
            }
        } catch (err) {
            console.error("Dashboard Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // -------------------------
    // 3. Status cards Configuration
    // -------------------------
    const statCards = [
        { icon: <Users size={24} />, title: "Total Customers", value: stats.totalUsers, growth: "+12%", color: "primary" },
        { icon: <Store size={24} />, title: "Active Sellers", value: stats.totalSellers, growth: "+5%", color: "success" },
        { icon: <Package size={24} />, title: "Total Orders", value: stats.totalOrders, growth: "+15", color: "warning" },
        // ✅ "Total Revenue" എന്ന പേര് മാറ്റി "Total Sales" എന്നാക്കി മാറ്റി
        { icon: <DollarSign size={24} />, title: "Total Sales", value: `₹${Number(stats.totalRevenue).toLocaleString('en-IN')}`, growth: "+18%", color: "info" },
    ];

    // -------------------------
    // 4. Loading state
    // -------------------------
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    // -------------------------
    // 5. Main Dashboard UI
    // -------------------------
    return (
        <div className="admin-dashboard-wrapper p-4 bg-light min-vh-100">
            <h2 className="fw-bold mb-4 text-dark">System Overview</h2>
            
            {/* Status Cards */}
            <div className="row g-4 mb-5">
                {statCards.map((stat, index) => (
                    <div className="col-lg-3 col-md-6" key={index}>
                        <div className={`card shadow-sm border-0 border-start border-${stat.color} border-5 h-100`} style={{ borderRadius: '12px' }}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <div className={`text-xs fw-bold text-${stat.color} text-uppercase mb-1`} style={{ fontSize: '0.75rem' }}>{stat.title}</div>
                                        <div className="h4 mb-0 fw-bold text-dark">{stat.value}</div>
                                    </div>
                                    <div className={`p-2 bg-${stat.color} bg-opacity-10 rounded text-${stat.color}`}>
                                        {stat.icon}
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <small className="text-muted">
                                        <span className="text-success fw-bold me-1">{stat.growth}</span>
                                        vs Last Month
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Sales Chart */}
            <div className="row g-4">
                <div className="col-12">
                    <div className="card shadow-sm border-0 p-4" style={{ borderRadius: '15px' }}>
                        <h5 className="fw-bold text-dark mb-4">Sales Performance Overview</h5>
                        <div style={{ width: '100%', height: '400px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.salesTrend}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fill: '#666', fontSize: 13}} 
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fill: '#666', fontSize: 13}} 
                                    />
                                    <Tooltip 
                                        cursor={{fill: '#f8f9fa'}} 
                                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                                    />
                                    <Bar dataKey="value" fill="#0d6efd" radius={[6, 6, 0, 0]} barSize={50} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;