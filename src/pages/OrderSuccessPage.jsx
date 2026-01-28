import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderSuccessPage = () => {
    const navigate = useNavigate();

    return (
        <div className="container py-5 text-center">
            <div className="card shadow p-5 border-0 rounded-4 bg-white mt-5">
                <div className="mb-4">
                    <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '5rem' }}></i>
                </div>
                <h1 className="fw-bold text-success">Order Placed!</h1>
                <p className="lead mb-4">നിങ്ങളുടെ ഓർഡർ വിജയകരമായി പ്ലേസ് ചെയ്തിരിക്കുന്നു.</p>
                <div className="d-flex justify-content-center gap-3">
                    <button onClick={() => navigate('/')} className="btn btn-primary px-4 py-2 rounded-pill">
                        Home
                    </button>
                    <button onClick={() => navigate('/my-orders')} className="btn btn-outline-dark px-4 py-2 rounded-pill">
                        My Orders
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;