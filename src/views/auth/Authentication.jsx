import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { Leaf } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

import { LoginApi, RegistrationApi, GoogleLoginApi } from "../../Redux/service/AllApi";

function Authentication({ register }) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [user, setUser] = useState({
    userName: "",
    email: "",
    password: "",
  });

  /* =========================
      INPUT CHANGE HANDLER
  ========================= */
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  /* =========================
      HANDLE AUTH SUCCESS
  ========================= */
  const handleAuthSuccess = (data) => {
    const userData = data.user;
    const token = data.token;

    if (!userData || !token) {
      toast.error("Authentication data is incomplete.");
      return;
    }

    // Save data to session storage
    sessionStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.setItem("token", token);

    const role = userData.role;

    // Role-based navigation
    if (role === "Admin") {
      navigate("/admin");
    } else if (role === "Seller") {
      navigate("/seller/dashboard");
    } else {
      navigate("/");
    }
  };

  /* =========================
      FORM SUBMISSION (Login/Register)
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (register && !user.userName) {
      return toast.warning("Please enter your full name.");
    }

    if (!user.email || !user.password) {
      return toast.warning("Please fill in all fields.");
    }

    try {
      setLoading(true);

      const payload = register
        ? { userName: user.userName, email: user.email.toLowerCase(), password: user.password }
        : { email: user.email.toLowerCase(), password: user.password };

      const result = await (register ? RegistrationApi(payload) : LoginApi(payload));

      if (result.status === 200 || result.status === 201) {
        toast.success(result.data?.message || "Action successful!");

        if (register) {
          setUser({ userName: "", email: "", password: "" });
          navigate("/login");
        } else {
          handleAuthSuccess(result.data);
        }
      }
    } catch (error) {
      console.error("Auth Error:", error);
      toast.error(error.response?.data?.message || "Server error. Please check your backend.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
      GOOGLE LOGIN HANDLER
  ========================= */
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);

        // 1. Fetch user info from Google
        const userInfo = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });

        // 2. Send Google data to Backend
        const result = await GoogleLoginApi({
          email: userInfo.data.email,
          userName: userInfo.data.name,
          googleId: userInfo.data.sub,
          picture: userInfo.data.picture,
        });

        if (result.status === 200 || result.status === 201) {
          toast.success(`Welcome ${userInfo.data.name}!`);
          handleAuthSuccess(result.data);
        }
      } catch (error) {
        console.error("Google Login Error:", error);
        toast.error("Google Authentication failed.");
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      toast.error("Google Login was cancelled.");
    },
  });

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <Leaf size={32} color="#10b981" />
        </div>

        <h2 style={styles.title}>{register ? "Join EcoMarket" : "Welcome Back"}</h2>

        <form onSubmit={handleSubmit}>
          {register && (
            <input
              style={styles.input}
              type="text"
              name="userName"
              placeholder="Full Name"
              value={user.userName}
              onChange={handleChange}
              required
            />
          )}

          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Email Address"
            value={user.email}
            onChange={handleChange}
            required
          />

          <div style={{ position: "relative" }}>
            <input
              style={styles.input}
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={user.password}
              onChange={handleChange}
              required
            />
            <span style={styles.eye} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button disabled={loading} style={styles.mainBtn}>
            {loading ? "Processing..." : register ? "Create Account" : "Login"}
          </button>
        </form>

        <div style={styles.or}>OR</div>

        <button type="button" style={styles.googleBtn} onClick={() => googleLogin()} disabled={loading}>
          <img
            src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
            alt="google"
            style={{ width: "20px", marginRight: "10px" }}
          />
          Continue with Google
        </button>

        <p style={styles.switch}>
          {register ? "Already have an account?" : "New to EcoMarket?"}
          <Link to={register ? "/login" : "/register"} style={styles.link}>
            {register ? " Login" : " Register"}
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#ecfdf5" },
  card: {
    background: "#fff",
    padding: "40px",
    width: "100%",
    maxWidth: "420px",
    borderRadius: "18px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
  },
  logo: { textAlign: "center", marginBottom: "10px" },
  title: { textAlign: "center", marginBottom: "20px", color: "#333", fontWeight: "700" },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    outline: "none",
  },
  eye: { position: "absolute", right: "15px", top: "14px", cursor: "pointer", color: "#666" },
  mainBtn: {
    width: "100%",
    padding: "12px",
    background: "#10b981",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
  },
  googleBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    marginTop: "10px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fff",
    fontWeight: "500",
  },
  or: { textAlign: "center", margin: "15px 0", color: "#888", fontSize: "14px" },
  switch: { textAlign: "center", marginTop: "15px", color: "#666", fontSize: "14px" },
  link: { color: "#10b981", fontWeight: "bold", marginLeft: "5px", textDecoration: "none" },
};

export default Authentication;
