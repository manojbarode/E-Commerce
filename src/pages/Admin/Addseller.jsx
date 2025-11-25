import React, { useState } from "react";
import "../Css/seller.css";
import axiosInstance from "../../api/axiosConfig";

const sellerRegister = (data) => axiosInstance.post("/seller/register", data);
const sellerLogin = (data) => axiosInstance.post("/seller/login", data);

const initialForm = {
  fullName: "",
  email: "",
  mobile: "",
  businessName: "",
  businessType: "",
  gstNumber: "",
  panNumber: "",
  warehouseAddress: "",
  city: "",
  state: "",
  pincode: "",
  bankAccountName: "",
  bankAccountNumber: "",
  ifscCode: "",
  bankName: "",
  category: "",
  productCount: "",
  password: "",
  confirmPassword: "",
};

export default function SellerAuth() {
  const [mode, setMode] = useState("register");
  const [formData, setFormData] = useState(initialForm);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (mode === "register") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setLoginData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateRegister = () => {
    const newErrors = {};

    [
      "fullName","email","mobile","businessName","businessType",
      "gstNumber","panNumber","warehouseAddress","city","state","pincode"
    ].forEach((field) => {
      if (!formData[field]) newErrors[field] = `${field} is required`;
    });

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLogin = () => {
    const newErrors = {};
    if (!loginData.email) newErrors.email = "Email is required";
    if (!loginData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validateRegister()) return;
    setLoading(true);
    try {
      const payload = { ...formData };
      delete payload.confirmPassword;
      const res = await sellerRegister(payload);
      const { token, fullName } = res.data;
      localStorage.setItem("sellerToken", token);
      localStorage.setItem("sellerName", fullName);
      alert("Seller registered successfully!");
      setFormData(initialForm);
    } catch (err) {
      alert(err.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;
    setLoading(true);
    try {
      const res = await sellerLogin(loginData);
      const { token, fullName } = res.data;
      localStorage.setItem("sellerToken", token);
      localStorage.setItem("sellerName", fullName);
      alert("Logged in successfully!");
    } catch (err) {
      alert(err.response?.data || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seller-auth-page">
      <div className="seller-auth-glass container py-4 py-lg-5">
        <div className="row g-0 shadow-lg rounded-4 overflow-hidden seller-flex-equal">

          {/* LEFT PANEL */}
          <div className="col-lg-6 seller-auth-left d-flex flex-column justify-content-between">
            <div>
              <span className="badge bg-light text-dark mb-3 px-3 py-2 rounded-pill">
                E-Shop Seller Portal
              </span>
              <h2 className="text-white fw-bold mb-3">
                Grow your business <br />
                with <span className="text-warning">E-Shop</span>
              </h2>
              <p className="text-light small mb-4">
                Sell your products with confidence. Manage listings, orders & payouts — all in one dashboard.
              </p>
            </div>
            <div className="text-light small">
              <div className="seller-dot-line"><div className="seller-dot" /> Fast payouts</div>
              <div className="seller-dot-line"><div className="seller-dot" /> Secure protection policy</div>
              <div className="seller-dot-line"><div className="seller-dot" /> Premium seller dashboard</div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="col-lg-6 bg-white p-4 p-md-5 seller-right-balanced">
            {/* Tabs */}
            <div className="d-flex justify-content-center mb-4 gap-4">
              <button
                type="button"
                className={`seller-tab ${mode === "login" ? "active" : ""}`}
                onClick={() => { setMode("login"); setErrors({}); }}>
                Login
              </button>
              <button
                type="button"
                className={`seller-tab ${mode === "register" ? "active" : ""}`}
                onClick={() => { setMode("register"); setErrors({}); }}>
                Register
              </button>
            </div>

            {/* LOGIN FORM */}
            {mode === "login" ? (
              <form onSubmit={handleLoginSubmit}>
                <h3 className="fw-semibold mb-3 text-center">Welcome Back 👋</h3>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleChange}
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleChange}
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
                <button className="seller-btn-gradient mt-2" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
            ) : (
              /* REGISTER FORM */
              <>
                <h3 className="fw-semibold mb-3 text-center">Create Seller Account</h3>
                <div className="seller-scrollable-form row">
                  {/* LEFT COLUMN */}
                  <div className="col-md-6">
                    {["fullName","email","mobile","businessName","businessType","gstNumber","panNumber","warehouseAddress","city"].map(field => (
                      <div className="mb-3" key={field}>
                        <label className="form-label">{field.replace(/([A-Z])/g," $1")}</label>
                        <input
                          type="text"
                          name={field}
                          value={formData[field]}
                          onChange={handleChange}
                          className={`form-control ${errors[field] ? "is-invalid" : ""}`}
                        />
                        {errors[field] && <div className="invalid-feedback">{errors[field]}</div>}
                      </div>
                    ))}
                  </div>
                  {/* RIGHT COLUMN */}
                  <div className="col-md-6">
                    {["bankAccountName","bankAccountNumber","ifscCode","bankName","category","productCount","password","confirmPassword","state","pincode"].map(field => (
                      <div className="mb-3" key={field}>
                        <label className="form-label">{field.replace(/([A-Z])/g," $1")}</label>
                        <input
                          type={field.toLowerCase().includes("password") ? "password" : "text"}
                          name={field}
                          value={formData[field]}
                          onChange={handleChange}
                          className={`form-control ${errors[field] ? "is-invalid" : ""}`}
                        />
                        {errors[field] && <div className="invalid-feedback">{errors[field]}</div>}
                      </div>
                    ))}
                  </div>
                </div>
                <button className="seller-submit-btn mt-2" onClick={handleRegisterSubmit} disabled={loading}>
                  {loading ? "Creating account..." : "Register"}
                </button>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
