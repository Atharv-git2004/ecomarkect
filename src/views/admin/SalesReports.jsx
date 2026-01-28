import React, { useEffect, useState } from 'react';
import { TrendingUp, IndianRupee, ShoppingBag, Users, Download } from 'lucide-react';
import { GetAdminStatsApi } from '../../Redux/service/AllApi';
import { toast } from 'react-toastify';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

function SalesReports() {
    const [reportType, setReportType] = useState('Monthly');
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalUsers: 0,
        revenueTrend: []
    });
    const [loading, setLoading] = useState(true);

    // Fetch report data based on selected type (Daily, Monthly, Yearly)
    const fetchReportData = async () => {
        setLoading(true);
        try {
            const token = sessionStorage.getItem("token");
            if (!token) {
                toast.error("Session expired. Please login.");
                return;
            }

            const header = { "Authorization": `Bearer ${token}` };
            const result = await GetAdminStatsApi(header);

            if (result.status === 200) {
                setStats({
                    totalRevenue: result.data.totalRevenue || 0,
                    totalOrders: result.data.totalOrders || 0,
                    totalUsers: result.data.totalUsers || 0,
                    revenueTrend: result.data.salesTrend?.map(item => ({
                        name: item.name,
                        revenue: item.value
                    })) || []
                });
            }
        } catch (err) {
            console.error("Report Error:", err);
            toast.error("Error fetching report data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReportData();
    }, [reportType]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="sales-reports-wrapper p-4 bg-light min-vh-100">
            {/* Header Section */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <h2 className="fw-bold text-dark d-flex align-items-center mb-0">
                    <TrendingUp size={30} className="me-2 text-success" /> Sales & Analytics
                </h2>
                <div className="d-flex gap-2">
                    <button className="btn btn-dark btn-sm d-flex align-items-center shadow-sm" onClick={() => window.print()}>
                        <Download size={16} className="me-2" /> Export PDF
                    </button>
                </div>
            </div>

            {/* 1. Summary Cards */}
            <div className="row g-4 mb-4">
                <div className="col-md-4">
                    <div className="card shadow-sm border-0 bg-success text-white p-4 h-100" style={{ borderRadius: '15px' }}>
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <p className="mb-1 small text-uppercase opacity-75 fw-bold">Total Revenue</p>
                                <h2 className="fw-bold mb-0">₹{stats.totalRevenue.toLocaleString('en-IN')}</h2>
                            </div>
                            <div className="p-2 bg-white bg-opacity-25 rounded shadow-sm">
                                <IndianRupee size={28} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm border-0 bg-primary text-white p-4 h-100" style={{ borderRadius: '15px' }}>
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <p className="mb-1 small text-uppercase opacity-75 fw-bold">Total Orders</p>
                                <h2 className="fw-bold mb-0">{stats.totalOrders}</h2>
                            </div>
                            <div className="p-2 bg-white bg-opacity-25 rounded shadow-sm">
                                <ShoppingBag size={28} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm border-0 bg-dark text-white p-4 h-100" style={{ borderRadius: '15px' }}>
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <p className="mb-1 small text-uppercase opacity-75 fw-bold">Active Users</p>
                                <h2 className="fw-bold mb-0">{stats.totalUsers}</h2>
                            </div>
                            <div className="p-2 bg-white bg-opacity-25 rounded shadow-sm">
                                <Users size={28} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Revenue Graph */}
            <div className="card shadow-sm p-4 mb-5 border-0 rounded-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0 text-dark">Revenue Trend Analysis</h5>
                    <select 
                        className="form-select form-select-sm w-auto border-0 bg-light fw-bold" 
                        value={reportType} 
                        onChange={(e) => setReportType(e.target.value)}
                    >
                        <option value="Daily">Daily View</option>
                        <option value="Monthly">Monthly View</option>
                        <option value="Yearly">Yearly View</option>
                    </select>
                </div>
                
                <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <AreaChart data={stats.revenueTrend}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#198754" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#198754" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#666', fontSize: 12}} 
                                dy={10} 
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#666', fontSize: 12}} 
                            />
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="revenue" 
                                stroke="#198754" 
                                strokeWidth={3} 
                                fillOpacity={1} 
                                fill="url(#colorRev)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default SalesReports;
