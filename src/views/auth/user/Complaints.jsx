import React, { useState, useEffect } from "react";
import { Send, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";

function Complaints() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });

  useEffect(() => {
    // Load user info from session
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    if (storedUser) {
      setUserData({
        userName: storedUser.userName || storedUser.name || "User",
        userEmail: storedUser.userEmail || storedUser.email || ""
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userData || !userData.userEmail) {
      toast.error("Please login to submit a complaint");
      return;
    }

    setLoading(true);

    const complaintPayload = {
      userName: userData.userName,
      userEmail: userData.userEmail,
      subject: formData.subject,
      message: formData.message,
    };

    console.log("Sending to backend:", complaintPayload);

    try {
      const response = await fetch("http://localhost:5000/api/complaints/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(complaintPayload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setLoading(false);
        setSubmitted(true);
        toast.success("Your complaint has been sent to the admin");
      } else {
        throw new Error(data.message || "Failed to submit complaint");
      }
    } catch (error) {
      setLoading(false);
      console.error("Submission Error:", error.message);
      toast.error(error.message);
    }
  };

  if (submitted) {
    return (
      <div className="container py-5 mt-5 text-center">
        <div className="card border-0 shadow-sm p-5 mx-auto" style={{ maxWidth: '500px', borderRadius: '20px' }}>
          <CheckCircle2 size={60} className="text-success mx-auto mb-4" />
          <h2 className="fw-bold">Thank You!</h2>
          <p className="text-muted">Your complaint has been successfully registered.</p>
          <button className="btn btn-success px-4 py-2 mt-3 rounded-pill" onClick={() => setSubmitted(false)}>
            Submit Another Complaint
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card border-0 shadow-lg p-4 p-md-5" style={{ borderRadius: '25px' }}>
            <div className="text-center mb-4">
              <h2 className="fw-bold text-dark">Submit a Complaint</h2>
              <p className="text-muted small">Tell us what's wrong. We're here to help.</p>
            </div>

            {!userData && (
              <div className="alert alert-warning d-flex align-items-center gap-2 border-0 small py-2 rounded-3">
                <AlertCircle size={18} /> Please login to identify your account.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Full Name</label>
                <input 
                  type="text" 
                  className="form-control bg-light border-0 py-2" 
                  value={userData?.userName || ""} 
                  readOnly 
                  disabled 
                  placeholder="Login to see your name"
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Subject</label>
                <select 
                  className="form-select border-light-subtle py-2 shadow-none"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                >
                  <option value="">Choose a reason...</option>
                  <option value="Delivery Issue">Delivery Issue</option>
                  <option value="Product Quality">Product Quality</option>
                  <option value="Payment Problem">Payment Problem</option>
                  <option value="Seller Behavior">Seller Behavior</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold">Message</label>
                <textarea 
                  className="form-control border-light-subtle shadow-none" 
                  rows="4" 
                  placeholder="Describe your issue in detail..."
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn btn-success w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm rounded-3"
                disabled={loading || !userData}
              >
                {loading ? "Sending..." : <><Send size={18} /> Submit Complaint</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Complaints;
