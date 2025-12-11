import React, { useState } from "react";
import "./Seller.css";
import { registerSeller, loginSeller } from "../../../api/SellApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function SellerAuth() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ email: "", mobile: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const switchTab = (value) => {
    const leftPanel = document.querySelector(".seller-auth-left");
    const rightPanel = document.querySelector(".seller-right-balanced");

    leftPanel.classList.add("fade-out");
    rightPanel.classList.add("fade-out");

    setTimeout(() => {
      setTab(value);
      setForm({ email: "", mobile: "", password: "" });
      leftPanel.classList.remove("fade-out");
      rightPanel.classList.remove("fade-out");
      leftPanel.classList.add("fade-in");
      rightPanel.classList.add("fade-in");
    }, 200);

    setTimeout(() => {
      leftPanel.classList.remove("fade-in");
      rightPanel.classList.remove("fade-in");
    }, 600);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (tab === "login") {
        const res = await loginSeller({
          email: form.email,
          password: form.password,
        });

        if (res.status === 200 && res.data?.data?.token) {
          toast.success(res.data.message || "Login Successful!");
          localStorage.setItem("sellerToken", res.data.data.token);
          localStorage.setItem("sellerName", res.data.data.fullName);

          // ✅ Use sellerUid instead of sellerId
          const sellerUid = res.data.data.sellerUid;
          localStorage.setItem("sellerUid", sellerUid);

          console.log("Seller UID: " + sellerUid);
          navigate("/sellerdashboard");
        } else {
          toast.error(res.data.message || "Login failed!");
        }
      } else {
        const res = await registerSeller({
          email: form.email,
          mobile: form.mobile,
          password: form.password,
        });

        if (res.data.status === 201) {
          toast.success(res.data.message || "Registration Successful!");

          // After registration → switch to login tab
          setTab("login");
          setForm({ email: form.email, password: "", mobile: "" });
        } else {
          toast.error(res.data.message || "Registration failed!");
        }
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Something went wrong!";
      toast.error(msg);
    }

    setLoading(false);
  };

  return (
    <div className="seller-auth-page">
      <div className="seller-auth-glass container py-4 py-lg-5">
        <div className="col-lg-6 seller-auth-left d-flex flex-column justify-content-between">
          <div>
            <span className="badge bg-light text-dark mb-3 px-3 py-2 rounded-pill">
              eShop Seller Portal
            </span>
            <h2 className="text-white fw-bold mb-3">
              Grow your business <br />
              with <span className="text-warning">eShop</span>
            </h2>
            <p className="text-light small mb-4">
              Manage your account with ease. Login or register to start selling.
            </p>
          </div>

          {tab === "register" && (
            <div className="text-center my-3">
              <img
                src="SellerHome.png"
                alt="E-shop seller graphic"
                className="img-fluid rounded"
              />
            </div>
          )}

          <div className="text-light small">
            <div className="seller-dot-line">
              <div className="seller-dot" />
              Fast payouts
            </div>
            <div className="seller-dot-line">
              <div className="seller-dot" /> Secure protection policy
            </div>
            <div className="seller-dot-line">
              <div className="seller-dot" /> Premium seller dashboard
            </div>
          </div>
        </div>

        <div className="col-lg-6 bg-white p-4 p-md-5 seller-right-balanced">
          <div className="d-flex justify-content-center mb-4 gap-4">
            <button
              className={`seller-tab ${tab === "login" ? "active" : ""}`}
              onClick={() => switchTab("login")}
            >
              Login
            </button>
            <button
              className={`seller-tab ${tab === "register" ? "active" : ""}`}
              onClick={() => switchTab("register")}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="seller-scrollable-form">
              {tab === "register" && (
                <div className="mb-3">
                  <label>Mobile</label>
                  <input
                    type="text"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
              )}

              <div className="mb-3">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            </div>

            <button type="submit" className="seller-submit-btn" disabled={loading}>
              {loading ? "Please wait..." : tab === "login" ? "Login" : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
