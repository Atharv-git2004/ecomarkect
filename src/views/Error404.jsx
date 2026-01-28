import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, AlertTriangle } from 'lucide-react';

function Error404() {
    return (
        // Main container: center the page vertically and horizontally
        <div className="container d-flex flex-column justify-content-center align-items-center text-center py-5" style={{ minHeight: '100vh' }}>
            
            <div className="card shadow-lg p-5" style={{ maxWidth: '600px', width: '100%' }}>
                <div className="card-body">
                    
                    {/* Large 404 heading */}
                    <h1 className="display-1 fw-bold text-danger mb-3">404</h1>
                    
                    {/* Icon and message */}
                    <AlertTriangle size={50} className="text-warning mb-4" />
                    <h3 className="fw-bold mb-3">Oops! Page Not Found</h3>
                    
                    <p className="text-muted mb-4">
                        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                    </p>

                    {/* Eco-Marketplace branding */}
                    <p className="mb-4 d-flex align-items-center justify-content-center">
                        <Leaf size={24} className="text-success me-2" />
                        Let's get you back to <strong>Eco-Marketplace</strong>.
                    </p>

                    {/* Button to go back to homepage */}
                    <Link to="/" className="btn btn-primary btn-lg fw-bold">
                        Go To Homepage
                    </Link>
                    
                    {/* Optional login links for admin or seller */}
                    <div className="mt-4 small">
                        Are you an <Link to="/admin" className="text-decoration-none text-danger">Admin</Link> or a <Link to="/seller" className="text-decoration-none text-info">Seller</Link>?
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Error404;
