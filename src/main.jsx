import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// ✅ Google OAuth Provider
import { GoogleOAuthProvider } from "@react-oauth/google";

// ✅ Global styles
import "./css/custom.css";

/**
 * 🔴 IMPORTANT:
 * നിങ്ങളുടെ ബാക്കെൻഡ് .env ഫയലിലുള്ള അതേ Client ID തന്നെ ഇവിടെയും നൽകണം.
 * ഗൂഗിൾ ക്ലൗഡ് കൺസോളിൽ Authorized JavaScript Origins-ൽ http://localhost:5173 
 * ഉണ്ടെന്ന് ഉറപ്പാക്കുക.
 */
const GOOGLE_CLIENT_ID = "30671830914-3vlfie9c5robgotp1s9rd31t98or96al.apps.googleusercontent.com";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    {/* ✅ App മുഴുവനും GoogleOAuthProvider-ന്റെ ഉള്ളിൽ നൽകുന്നു */}
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);