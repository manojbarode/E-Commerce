import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function SellerLogout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("sellerToken");
    localStorage.removeItem("sellerName");
    localStorage.removeItem("sellerId");

    const timer = setTimeout(() => {
      navigate("/");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh", background: "#f8f9fa" }}
    >
      <div className="text-center p-4 bg-white shadow rounded-4">
        <div className="spinner-border text-danger mb-3" role="status"></div>
        <h3 className="fw-bold text-dark">Logging out...</h3>
        <p className="text-muted small">Please wait, redirecting to login page.</p>
      </div>
    </div>
  );
}
