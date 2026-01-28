import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { GetProductByIdApi, UpdateProductApi } from "../../Redux/service/AllApi"; 

function EditProduct() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const [product, setProduct] = useState({
        name: '',
        price: '',
        stock: '',
        description: '',
        image: ''
    });

    // Fetch product details on component mount
    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const result = await GetProductByIdApi(id); 
                
                if (result.status === 200) {
                    setProduct({
                        name: result.data.name || '',
                        price: result.data.price || '',
                        stock: result.data.stock ?? result.data.quantity ?? '',
                        description: result.data.description || '',
                        image: result.data.image || ''
                    });
                }
            } catch (err) {
                console.error("Fetch Error:", err);
                toast.error("Failed to load product details.");
            } finally {
                setLoading(false);
            }
        };
        fetchProductData();
    }, [id]);

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    // Submit updated product details
    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);

        const token = sessionStorage.getItem("token");
        const header = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };

        const updatedBody = {
            name: product.name,
            price: Number(product.price),
            stock: Number(product.stock),
            description: product.description,
            image: product.image
        };

        try {
            const result = await UpdateProductApi(id, updatedBody, header);
            if (result.status === 200 || result.status === 201) {
                toast.success("Product updated successfully!");
                navigate('/seller/products');
            }
        } catch (err) {
            console.error("Update Error:", err);
            toast.error("Failed to update product.");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{height: '80vh'}}>
            <Loader2 className="animate-spin text-success" size={40} />
        </div>
    );

    return (
        <div className="container py-4 text-start animate-fade-in">
            <Link to="/seller/products" className="btn btn-link text-muted mb-4 p-0 text-decoration-none d-flex align-items-center">
                <ArrowLeft size={18} className="me-1" /> Back to Inventory
            </Link>

            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
                <div className="d-flex align-items-center mb-4">
                    <div className="bg-success-subtle p-2 rounded-3 me-3 text-success">
                        <Edit size={24} />
                    </div>
                    <h4 className="fw-bold mb-0">Update Product Details</h4>
                </div>

                <form onSubmit={handleUpdate}>
                    <div className="row">
                        {/* Image Preview Section */}
                        <div className="col-md-4 mb-4">
                            <label className="form-label fw-semibold">Product Image Preview</label>
                            <div className="border rounded-4 overflow-hidden bg-light d-flex align-items-center justify-content-center" style={{ height: '250px' }}>
                                {product.image ? (
                                    <img src={product.image} alt="Preview" className="img-fluid object-fit-cover h-100 w-100" />
                                ) : (
                                    <div className="text-muted text-center">
                                        <ImageIcon size={48} className="mb-2 opacity-25" />
                                        <p className="small">No image available</p>
                                    </div>
                                )}
                            </div>
                            <input 
                                type="text" 
                                name="image" 
                                className="form-control mt-2 shadow-none small" 
                                placeholder="Image URL"
                                value={product.image} 
                                onChange={handleChange} 
                            />
                        </div>

                        {/* Form Fields Section */}
                        <div className="col-md-8">
                            {/* Product Name */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Product Name</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    className="form-control py-2 shadow-none" 
                                    value={product.name} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>

                            {/* Price & Stock */}
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">Price (₹)</label>
                                    <input 
                                        type="number" 
                                        name="price" 
                                        className="form-control py-2 shadow-none" 
                                        value={product.price} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">Stock Units</label>
                                    <input 
                                        type="number" 
                                        name="stock" 
                                        className="form-control py-2 shadow-none" 
                                        value={product.stock} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold">Description</label>
                                <textarea 
                                    name="description" 
                                    className="form-control shadow-none" 
                                    rows="5" 
                                    value={product.description} 
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            {/* Action Buttons */}
                            <div className="d-flex gap-2">
                                <button type="submit" disabled={updating} className="btn btn-success px-5 py-2 rounded-pill shadow-sm d-flex align-items-center">
                                    {updating ? (
                                        <><Loader2 className="animate-spin me-2" size={16} /> Saving...</>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </button>
                                <button type="button" onClick={() => navigate('/seller/products')} className="btn btn-light px-4 rounded-pill border">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <style>{`
                .animate-fade-in { animation: fadeIn 0.4s ease-out; }
                @keyframes fadeIn { from { opacity: 0; translateY(10px); } to { opacity: 1; translateY(0); } }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

export default EditProduct;