import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Store, MapPin, Leaf, CreditCard, Save, Loader, Edit3, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';

function SellerProfile() {
    const [profile, setProfile] = useState({
        storeName: '',
        email: '',
        description: '',
        address: '',
        ecoCertificationId: '',
        expiryDate: '',
        ecoCommitment: '',
    });
    
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    // 1. Fetch profile details from backend
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = sessionStorage.getItem("token");
                const res = await axios.get('http://localhost:5000/api/seller/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (res.data && res.data.storeName) {
                    setProfile(res.data);
                    setIsEditing(false); // Start in view mode if data exists
                } else {
                    setIsEditing(true); // Start in edit mode if no data
                }
            } catch (err) {
                console.error("Error fetching profile", err);
                setIsEditing(true); 
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    // 2. Save profile details
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const token = sessionStorage.getItem("token");
            await axios.post('http://localhost:5000/api/seller/profile', profile, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            toast.success('Profile updated and submitted for admin review!');
            setIsEditing(false);
        } catch (err) {
            toast.error('Failed to update profile. Check your connection.');
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="text-center">
                <Loader className="animate-spin text-success mb-2" size={40} />
                <p>Loading Profile Details...</p>
            </div>
        </div>
    );

    return (
        <div className="seller-profile-wrapper p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-dark d-flex align-items-center m-0">
                    <Store size={32} className="me-2 text-success" /> Store Profile
                </h2>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="btn btn-outline-primary d-flex align-items-center shadow-sm">
                        <Edit3 size={18} className="me-2" /> Edit Profile
                    </button>
                )}
            </div>
            
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                <div className="card-header bg-success bg-opacity-10 border-0 p-3">
                    <span className="text-success fw-bold">Verification Status: {profile.isVerified || 'Not Submitted'}</span>
                </div>
                <form onSubmit={handleSave} className="card-body p-4">
                    
                    {/* Store Basic Details */}
                    <h5 className="mb-4 text-primary fw-bold border-bottom pb-2">Basic Information</h5>
                    <div className="row g-4 mb-5">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Store Name</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="storeName" 
                                value={profile.storeName || ''} 
                                onChange={handleChange} 
                                disabled={!isEditing} 
                                required 
                                placeholder="Enter store name" 
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Contact Email</label>
                            <input 
                                type="email" 
                                className="form-control" 
                                name="email" 
                                value={profile.email || ''} 
                                onChange={handleChange} 
                                disabled={!isEditing} 
                                required 
                                placeholder="store@example.com" 
                            />
                        </div>
                        <div className="col-12">
                            <label className="form-label fw-semibold">Store Description</label>
                            <textarea 
                                className="form-control" 
                                name="description" 
                                rows="3" 
                                value={profile.description || ''} 
                                onChange={handleChange} 
                                disabled={!isEditing} 
                                required 
                                placeholder="Describe your eco-friendly business..." 
                            />
                        </div>
                        <div className="col-12">
                            <label className="form-label fw-semibold d-flex align-items-center">
                                <MapPin size={18} className="me-2 text-danger" /> Business Address
                            </label>
                            <textarea 
                                className="form-control" 
                                name="address" 
                                rows="2" 
                                value={profile.address || ''} 
                                onChange={handleChange} 
                                disabled={!isEditing} 
                                required 
                                placeholder="Complete address with postal code" 
                            />
                        </div>
                    </div>

                    {/* Eco Compliance Section */}
                    <h5 className="mb-4 text-success fw-bold border-bottom pb-2">Eco-Compliance & Certifications</h5>
                    <div className="bg-light p-4 rounded-3 mb-5 border-start border-success border-4">
                        <div className="row g-4">
                            <div className="col-md-8">
                                <label className="form-label fw-bold">Eco Certification ID / License</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    name="ecoCertificationId" 
                                    value={profile.ecoCertificationId || ''} 
                                    onChange={handleChange} 
                                    disabled={!isEditing} 
                                    placeholder="e.g. ISO-14001, Organic India ID" 
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-bold">Expiry Date</label>
                                <input 
                                    type="date" 
                                    className="form-control" 
                                    name="expiryDate" 
                                    value={profile.expiryDate ? profile.expiryDate.split('T')[0] : ''} 
                                    onChange={handleChange} 
                                    disabled={!isEditing} 
                                />
                            </div>
                            <div className="col-12">
                                <label className="form-label fw-bold">Eco Commitment Statement</label>
                                <textarea 
                                    className="form-control" 
                                    name="ecoCommitment" 
                                    rows="2" 
                                    value={profile.ecoCommitment || ''} 
                                    onChange={handleChange} 
                                    disabled={!isEditing} 
                                    required 
                                    placeholder="E.g. We use 100% plastic-free packaging..." 
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Finance Alert */}
                    <div className="alert alert-secondary d-flex align-items-center border-0 shadow-sm mb-5">
                        <CreditCard size={20} className="me-3" />
                        <span className="small">Bank account and payout details are managed in the <strong>Finance</strong> section for enhanced security.</span>
                    </div>

                    {/* Action Buttons */}
                    {isEditing && (
                        <div className="d-flex gap-3 pt-3 border-top">
                            <button type="submit" className="btn btn-success btn-lg px-5 rounded-pill shadow-sm d-flex align-items-center">
                                <Save size={20} className="me-2" /> Save Profile
                            </button>
                            <button type="button" onClick={() => setIsEditing(false)} className="btn btn-light btn-lg px-4 rounded-pill border d-flex align-items-center">
                                <XCircle size={20} className="me-2" /> Cancel
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default SellerProfile;
