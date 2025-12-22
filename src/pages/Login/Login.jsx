import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

import { loginUser as loginApi, fetchUserProfile } from "../../api/authApi";
import { loginUser as loginUserAction, logoutUser } from "../../Redux/authSlice";

const ONE_HOUR = 60 * 60 * 1000; // 1 hour in ms

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ==============================
      CHECK SESSION ON REFRESH
  ============================== */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiry = localStorage.getItem("tokenExpiry");

    if (token && expiry) {
      if (Date.now() > Number(expiry)) {
        // session expired
        localStorage.clear();
        dispatch(logoutUser());
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else {
        // auto logout timer (without refresh)
        const remainingTime = Number(expiry) - Date.now();
        setTimeout(() => {
          localStorage.clear();
          dispatch(logoutUser());
          toast.error("Session expired. Please login again.");
          navigate("/login");
        }, remainingTime);
      }
    }
  }, [dispatch, navigate]);

  /* ==============================
      LOGIN HANDLER
  ============================== */
  const handleLoginSubmit = async (e) => {
  e.preventDefault();
  if (loading) return;

  if (!email || !password) {
    toast.error("Please enter email and password");
    return;
  }

  setLoading(true);

  try {
    // 1️⃣ Login → token only
    const res = await loginApi({ email, password });

    const token = res.token;
    if (!token) {
      throw new Error("Token not received from server");
    }

    // 2️⃣ Save token first
    sessionStorage.setItem("token", token);

    // 3️⃣ Fetch profile using token
    const profile = await fetchUserProfile();

    // 4️⃣ Redux update
    dispatch(
      loginUserAction({
        token,
        user: profile,
      })
    );

    toast.success("Login successful!");
    navigate("/");

  } catch (err) {
    toast.error(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};


  /* ==============================
      UI
  ============================== */
  return (
    <div style={{ background: "#f8f9fa", padding: "60px 0" }}>
      <div className="container d-flex justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-lg border-0 rounded-4 p-4">
            <h3 className="text-center fw-bold mb-4 text-danger">
              Sign In
            </h3>

            <form onSubmit={handleLoginSubmit}>
              <input type="email" className="form-control mb-3 rounded-pill" placeholder="Email"
                value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} required/>

              <input type="password" className="form-control mb-3 rounded-pill" placeholder="Password"
                value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} required/>

              <button type="submit" className="btn btn-danger w-100 rounded-pill fw-bold" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <p className="text-center mt-3">
              Don&apos;t have an account?{" "}
              <button className="btn btn-link p-0" onClick={() => navigate("/signup")} disabled={loading}>
                Sign Up
              </button>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
