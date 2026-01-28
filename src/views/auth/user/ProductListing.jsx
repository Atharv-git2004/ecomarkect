import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import ProductCard from '../../../css/components/common/ProductCard';
import { GetAllProductsApi } from '../../../Redux/service/AllApi';

const ProductListing = () => {
    const [allProducts, setAllProducts] = useState([]); 
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortBy, setSortBy] = useState("default");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await GetAllProductsApi();
            if (res.status === 200) {
                setAllProducts(res.data);
            }
        } catch (err) {
            console.error("Error fetching products:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = allProducts
        .filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            if (sortBy === "low") return a.price - b.price;
            if (sortBy === "high") return b.price - a.price;
            return 0;
        });

    return (
        <div className="bg-light min-vh-100">
            {/* Header */}
            <div className="bg-white border-bottom py-4 mb-4">
                <div className="container text-start">
                    <h2 className="fw-bold mb-0">Explore Sustainable Products</h2>
                    <p className="text-muted mb-0">
                        {loading ? "Discovering eco-friendly items..." : `Showing ${filteredProducts.length} verified sustainable products`}
                    </p>
                </div>
            </div>

            <div className="container pb-5">
                <div className="row g-4">
                    {/* Sidebar Filters */}
                    <div className="col-lg-3 d-none d-lg-block text-start">
                        <div className="card border-0 shadow-sm p-4 rounded-4 sticky-top" style={{ top: '100px' }}>
                            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                <SlidersHorizontal size={20} className="text-success"/> Filters
                            </h5>
                            
                            <div className="mb-4">
                                <h6 className="fw-bold small text-uppercase text-muted mb-3">Categories</h6>
                                {["All", "Home Decor", "Personal Care", "Kitchenware", "Fashion"].map(cat => (
                                    <div className="form-check mb-2" key={cat}>
                                        <input 
                                            className="form-check-input shadow-none" 
                                            type="radio" 
                                            name="category" 
                                            id={`cat-${cat}`}
                                            checked={selectedCategory === cat}
                                            onChange={() => setSelectedCategory(cat)}
                                        />
                                        <label className="form-check-label small" htmlFor={`cat-${cat}`} style={{cursor:'pointer'}}>
                                            {cat}
                                        </label>
                                    </div>
                                ))}
                            </div>

                            <hr className="my-4 opacity-10" />

                            <div>
                                <h6 className="fw-bold small text-uppercase text-muted mb-3">Sort By Price</h6>
                                <select className="form-select form-select-sm border-0 bg-light rounded-3 shadow-none" 
                                        onChange={(e) => setSortBy(e.target.value)}>
                                    <option value="default">Newest First</option>
                                    <option value="low">Price: Low to High</option>
                                    <option value="high">Price: High to Low</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-lg-9">
                        {/* Search Bar */}
                        <div className="card border-0 shadow-sm p-2 mb-4 rounded-pill overflow-hidden">
                            <div className="input-group">
                                <span className="input-group-text bg-transparent border-0 ps-3">
                                    <Search size={20} className="text-muted" />
                                </span>
                                <input 
                                    type="text" 
                                    className="form-control border-0 shadow-none py-2" 
                                    placeholder="Search for eco-friendly products..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Product Grid */}
                        {loading ? (
                             <div className="text-center py-5">
                                 <Loader2 className="animate-spin text-success mx-auto" size={40} />
                                 <p className="mt-3 text-muted">Fetching verified products...</p>
                             </div>
                        ) : filteredProducts.length > 0 ? (
                            <div className="row g-4 text-start">
                                {filteredProducts.map((product) => (
                                    <div key={product._id} className="col-md-6 col-lg-4">
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-5 bg-white rounded-4 shadow-sm border">
                                <img src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png" alt="No results" style={{ width: '80px', opacity: 0.4 }} />
                                <h5 className="mt-4 fw-bold text-dark">No Products Found</h5>
                                <p className="text-muted">Try adjusting your filters or search term.</p>
                                <button className="btn btn-success btn-sm rounded-pill px-4" 
                                        onClick={() => {setSearchTerm(""); setSelectedCategory("All");}}>
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .form-check-input:checked {
                    background-color: #198754;
                    border-color: #198754;
                }
                .form-check-input:focus {
                    box-shadow: none;
                    border-color: #198754;
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default ProductListing;
