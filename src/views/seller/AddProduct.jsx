import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
    Tag, IndianRupee, Image as ImageIcon, 
    AlignLeft, CheckCircle, Package, Loader2, XCircle, Leaf 
} from 'lucide-react';
import { AddProductApi } from '../../Redux/service/AllApi';

function AddProduct() {
    const navigate = useNavigate();
    const [token, setToken] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initial state setup
    const initialProductState = {
        name: "",
        price: "",
        stock: "", 
        category: "Home Decor", 
        image: "", 
        description: "",
        ecoClaim: ""
    };

    const [productDetails, setProductDetails] = useState(initialProductState);

    // സെല്ലർ ലോഗിൻ ചെയ്തിട്ടുണ്ടോ എന്ന് പരിശോധിക്കുന്നു
    useEffect(() => {
        const existingToken = sessionStorage.getItem("token");
        if (existingToken) {
            setToken(existingToken);
        } else {
            toast.warning("Please login as a seller first");
            navigate('/login');
        }
    }, [navigate]);

    // ഫോം സബ്മിഷൻ കൈകാര്യം ചെയ്യുന്നു
    const handlePublish = async (e) => {
        e.preventDefault();
        const { name, price, stock, category, image, description } = productDetails;

        // ഫ്രണ്ട്-എൻഡ് വാലിഡേഷൻ
        if (!name || !price || !stock || !category || !image || !description) {
            toast.info("Please fill all mandatory fields");
            return;
        }

        if (Number(price) <= 0 || Number(stock) < 0) {
            toast.error("Price and Stock must be valid numbers");
            return;
        }

        setIsSubmitting(true);
        
        // Header സെറ്റ് ചെയ്യുന്നു
        const reqHeader = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };

        try {
            const finalData = {
                ...productDetails,
                price: Number(price),
                stock: Number(stock)
            };

            const result = await AddProductApi(finalData, reqHeader);

            if (result.status === 201 || result.status === 200) {
                toast.success("Product Submitted for Admin Approval! 🎉");
                // ഫോം റീസെറ്റ് ചെയ്യുന്നു
                setProductDetails(initialProductState);
                navigate('/seller/products');
            } else {
                // ബാക്കെൻഡിൽ നിന്നുള്ള കൃത്യമായ എറർ മെസ്സേജ് കാണിക്കാൻ
                const errorMsg = result.response?.data?.message || "Failed to add product";
                toast.error(errorMsg);
            }
        } catch (err) {
            console.error("Add Product Error:", err);
            toast.error("Network Error: Connection to server failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container-fluid py-4 min-vh-100" style={{ backgroundColor: '#f4f7f6' }}>
            <div className="row justify-content-center">
                <div className="col-lg-11 col-xl-10">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        
                        {/* Header Section */}
                        <div className="card-header bg-success text-white p-4 border-0 d-flex justify-content-between align-items-center">
                            <div>
                                <h4 className="mb-1 d-flex align-items-center gap-2 fw-bold">
                                    <Leaf size={24} /> Add New Eco-Product
                                </h4>
                                <p className="mb-0 opacity-75 small">List your sustainable items for the green community</p>
                            </div>
                            <button 
                                className="btn btn-sm btn-light rounded-circle p-2 shadow-sm border-0" 
                                onClick={() => navigate('/seller/products')}
                                type="button"
                            >
                                <XCircle size={20} className="text-danger" />
                            </button>
                        </div>

                        {/* Form Body */}
                        <div className="card-body p-4 p-md-5 bg-white">
                            <form onSubmit={handlePublish} className="text-start">
                                <div className="row g-4">
                                    
                                    {/* Image Preview Section */}
                                    <div className="col-md-5">
                                        <label className="form-label small fw-bold mb-2">Product Preview</label>
                                        <div 
                                            className="rounded-4 d-flex align-items-center justify-content-center border-dashed position-relative mb-3"
                                            style={{ 
                                                width: '100%', 
                                                height: '320px', 
                                                backgroundColor: '#f9fafb', 
                                                border: '2px dashed #cbd5e0',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            {productDetails.image ? (
                                                <img 
                                                    src={productDetails.image} 
                                                    alt="Preview" 
                                                    className="h-100 w-100 object-fit-cover" 
                                                    onError={(e) => {
                                                        e.target.src = "https://via.placeholder.com/400x320?text=Invalid+Image+URL";
                                                    }} 
                                                />
                                            ) : (
                                                <div className="text-center text-muted opacity-50">
                                                    <ImageIcon size={60} className="mb-2" />
                                                    <p className="small mb-0 px-3">Enter a valid Image URL to see preview</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="alert alert-warning border-0 small py-2 rounded-3">
                                            💡 <strong>Note:</strong> Use high-quality image links (JPG/PNG).
                                        </div>
                                    </div>

                                    {/* Input Fields */}
                                    <div className="col-md-7">
                                        <div className="row g-3">
                                            <div className="col-12">
                                                <label className="form-label small fw-bold"><Tag size={14} className="me-1" /> Product Name*</label>
                                                <input 
                                                    type="text" 
                                                    className="form-control bg-light border-0 py-2 shadow-none"
                                                    placeholder="e.g. Handmade Bamboo Mug"
                                                    value={productDetails.name}
                                                    onChange={e => setProductDetails({ ...productDetails, name: e.target.value })}
                                                />
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold"><IndianRupee size={14} className="me-1" /> Price (₹)*</label>
                                                <input 
                                                    type="number" 
                                                    className="form-control bg-light border-0 py-2 shadow-none"
                                                    placeholder="0.00"
                                                    value={productDetails.price}
                                                    onChange={e => setProductDetails({ ...productDetails, price: e.target.value })}
                                                />
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold"><Package size={14} className="me-1" /> Stock Count*</label>
                                                <input 
                                                    type="number" 
                                                    className="form-control bg-light border-0 py-2 shadow-none"
                                                    placeholder="Available units"
                                                    value={productDetails.stock}
                                                    onChange={e => setProductDetails({ ...productDetails, stock: e.target.value })}
                                                />
                                            </div>

                                            <div className="col-12">
                                                <label className="form-label small fw-bold"><AlignLeft size={14} className="me-1" /> Category*</label>
                                                <select 
                                                    className="form-select bg-light border-0 py-2 shadow-none cursor-pointer"
                                                    value={productDetails.category}
                                                    onChange={e => setProductDetails({ ...productDetails, category: e.target.value })}
                                                >
                                                    {/* Backend Model enum-മായി യോജിക്കുന്ന കാറ്റഗറികൾ */}
                                                    <option value="Home Decor">Home Decor</option>
                                                    <option value="Personal Care">Personal Care</option>
                                                    <option value="Kitchenware">Kitchenware</option>
                                                    <option value="Fashion">Fashion</option>
                                                    <option value="Electronics">Electronics</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>

                                            <div className="col-12">
                                                <label className="form-label small fw-bold"><ImageIcon size={14} className="me-1" /> Image URL*</label>
                                                <input 
                                                    type="text" 
                                                    className="form-control bg-light border-0 py-2 shadow-none"
                                                    placeholder="https://example.com/image.jpg"
                                                    value={productDetails.image}
                                                    onChange={e => setProductDetails({ ...productDetails, image: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description Section */}
                                    <div className="col-12">
                                        <hr className="my-2 opacity-25" />
                                        <label className="form-label small fw-bold">Detailed Product Description*</label>
                                        <textarea 
                                            className="form-control bg-light border-0 shadow-none p-3" 
                                            rows="4"
                                            placeholder="Describe its materials and eco-benefits..."
                                            value={productDetails.description}
                                            onChange={e => setProductDetails({ ...productDetails, description: e.target.value })}
                                        ></textarea>
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label small fw-bold text-success">
                                            <CheckCircle size={14} className="me-1" /> Sustainability Badge / Eco-Claim (Optional)
                                        </label>
                                        <input 
                                            type="text" 
                                            className="form-control bg-light border-0 py-2 shadow-none"
                                            placeholder="e.g. 100% Organic, Plastic-free"
                                            value={productDetails.ecoClaim}
                                            onChange={e => setProductDetails({ ...productDetails, ecoClaim: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-5 d-flex flex-column flex-md-row gap-3">
                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        className="btn btn-success btn-lg px-5 flex-grow-1 rounded-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 border-0 py-3"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Package size={20} />}
                                        {isSubmitting ? "Submitting..." : "Publish Product"}
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-light btn-lg px-5 rounded-3 fw-bold text-muted border py-3"
                                        onClick={() => navigate('/seller/products')}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>{`
                .border-dashed { border-style: dashed !important; }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .object-fit-cover { object-fit: cover; }
                .cursor-pointer { cursor: pointer; }
                input:focus, select:focus, textarea:focus {
                    background-color: #f0fdf4 !important;
                    box-shadow: 0 0 0 2px rgba(25, 135, 84, 0.1) !important;
                }
            `}</style>
        </div>
    );
}

export default AddProduct;