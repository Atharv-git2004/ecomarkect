import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, Search, Package, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { GetSellerProductsApi, DeleteProductApi } from '../../Redux/service/AllApi';
import { toast } from 'react-toastify';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Search Debouncing
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch Seller Products
  const fetchSellerProducts = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        toast.error("Session expired. Please login.");
        return;
      }

      const header = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };

      const result = await GetSellerProductsApi(header);

      if (result && (result.status === 200 || result.status === 201)) {
        // API response structure handle ചെയ്യുന്നു
        const fetchedData = result.data?.products || result.data?.allProducts || (Array.isArray(result.data) ? result.data : []);
        setProducts(fetchedData);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Could not load your products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerProducts();
  }, []);

  // Delete Product
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const token = sessionStorage.getItem("token");
      const header = { "Authorization": `Bearer ${token}` };
      try {
        const result = await DeleteProductApi(id, header);
        if ([200, 201, 204].includes(result.status)) {
          toast.success("Product deleted successfully");
          setProducts(prev => prev.filter(p => p._id !== id));
        } else {
          toast.error(result.data?.message || "Error deleting product.");
        }
      } catch (err) {
        toast.error("Error deleting product.");
      }
    }
  };

  // UI Helpers
  function getStockBadge(stock) {
    const s = Number(stock || 0);
    if (s <= 0) return <span className="badge rounded-pill bg-danger-subtle text-danger border border-danger">Out of Stock</span>;
    if (s <= 5) return <span className="badge rounded-pill bg-warning-subtle text-dark border border-warning">Low Stock</span>;
    return <span className="badge rounded-pill bg-success-subtle text-success border border-success">In Stock</span>;
  }

  function getApprovalStatus(status) {
    if (status) {
      return (
        <span className="badge rounded-pill bg-success text-white d-inline-flex align-items-center gap-1 px-2 py-1">
          <CheckCircle size={12} /> Approved
        </span>
      );
    }
    return (
      <span className="badge rounded-pill bg-secondary text-white d-inline-flex align-items-center gap-1 px-2 py-1">
        <Clock size={12} /> Pending
      </span>
    );
  }

  // Filter Logic
  const filteredProducts = Array.isArray(products) ? products.filter(p =>
    p.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    p.category?.toLowerCase().includes(debouncedSearch.toLowerCase())
  ) : [];

  return (
    <div className="container-fluid p-4 text-start animate-fade-in bg-light min-vh-100">
      {/* Header Section */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-black text-dark mb-1 d-flex align-items-center gap-2">
            <Package className="text-success" size={32} />
            Inventory Management
          </h2>
          <p className="text-muted small mb-0">
            Manage your eco-friendly products. Total: <b>{products.length}</b>
          </p>
        </div>
        <Link to="/seller/add-product" className="btn btn-success rounded-pill px-4 py-2 fw-bold shadow-sm d-flex align-items-center justify-content-center transition-scale text-decoration-none">
          <PlusCircle size={18} className="me-2" /> Add New Product
        </Link>
      </div>

      {/* Search Bar */}
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-3">
        <div className="p-3 bg-white border-bottom d-flex align-items-center">
          <div className="input-group bg-light rounded-pill px-3 border border-2 border-transparent focus-within-green" style={{ maxWidth: '450px' }}>
            <span className="input-group-text bg-transparent border-0 text-muted"><Search size={18} /></span>
            <input
              type="text"
              className="form-control bg-transparent border-0 shadow-none py-2"
              placeholder="Search by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="btn btn-sm btn-light rounded-circle ms-2">×</button>
            )}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light text-secondary small text-uppercase fw-bold">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="py-3">Category</th>
                <th className="py-3">Price</th>
                <th className="py-3">Stock</th>
                <th className="py-3 text-center">Approval</th>
                <th className="py-3 text-end px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan="6" className="py-4">
                      <div className="bg-light rounded" style={{ height: '50px', animation: 'pulse 1.5s infinite' }}></div>
                    </td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    <AlertCircle size={48} className="mb-2 opacity-25" />
                    <h5>No Products in Inventory</h5>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    <AlertCircle size={48} className="mb-2 opacity-25" />
                    <h5>No products match your search.</h5>
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => (
                  <tr key={product._id} className="transition-all">
                    <td className="px-4">
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={product.image || 'https://placehold.co/100'}
                          width="50" height="50"
                          className="rounded-3 border object-fit-cover shadow-sm"
                          alt={product.name}
                        />
                        <div>
                          <div className="fw-bold text-dark">{product.name}</div>
                          <div className="text-muted extra-small">ID: #{product._id?.slice(-6).toUpperCase()}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="text-muted small">{product.category || 'Uncategorized'}</span></td>
                    <td className="fw-bold text-dark">₹{Number(product.price || 0).toLocaleString('en-IN')}</td>
                    <td>{getStockBadge(product.stock)}</td>
                    <td className="text-center">{getApprovalStatus(product.isApproved)}</td>
                    <td className="text-end px-4">
                      <div className="d-flex justify-content-end gap-2">
                        {/* ⚠️ Fixed Edit Link: Relative path avoid double routing */}
                        <Link 
                          to={`/seller/edit-product/${product._id}`} 
                          className="btn btn-sm btn-light border rounded-circle p-2 hover-blue shadow-sm d-flex align-items-center justify-content-center"
                        >
                          <Edit size={16} className="text-primary" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(product._id)} 
                          className="btn btn-sm btn-light border rounded-circle p-2 hover-red shadow-sm d-flex align-items-center justify-content-center"
                        >
                          <Trash2 size={16} className="text-danger" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .fw-black { font-weight: 900; }
        .extra-small { font-size: 0.7rem; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .transition-all:hover { background-color: #f8fdfa; }
        .transition-scale:hover { transform: scale(1.05); }
        .hover-red:hover { background-color: #fee2e2 !important; border-color: #ef4444 !important; }
        .hover-blue:hover { background-color: #e0f2fe !important; border-color: #0ea5e9 !important; }
        .focus-within-green:focus-within { border-color: #198754 !important; }
        @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
      `}</style>
    </div>
  );
}

export default ProductList;