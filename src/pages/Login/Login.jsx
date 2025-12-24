import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

import { loginUser as loginApi, fetchUserProfile } from "../../api/authApi";
import { loginUser as loginUserAction, logoutUser } from "../../Redux/authSlice";

// ================= CONFIG =================
// 1 minute for testing (production me 60 * 60 * 1000)
// const ONE_MINUTE = 1 * 60 * 1000;
const ONE_MINUTE = 60*60*1000;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ================= LOGOUT FUNCTION =================
  const handleLogout = () => {
    sessionStorage.clear();
    dispatch(logoutUser());
    toast.error("Session expired. Please login again.");
    navigate("/login");
  };

  // ================= SESSION CHECK (REFRESH SAFE) =================
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const expiry = sessionStorage.getItem("tokenExpiry");

    if (token && expiry) {
      const remainingTime = Number(expiry) - Date.now();

      if (remainingTime <= 0) {
        handleLogout();
      } else {
        const logoutTimer = setTimeout(() => {
          handleLogout();
        }, remainingTime);

        return () => clearTimeout(logoutTimer);
      }
    }
  }, []);

  // ================= LOGIN SUBMIT =================
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const res = await loginApi({ email, password });
      const token = res.token;
      if (!token) throw new Error("Token missing");

      // token expiry time
      const expiryTime = Date.now() + ONE_MINUTE;

      sessionStorage.setItem("token", token);
      sessionStorage.setItem("tokenExpiry", expiryTime);

      const profile = await fetchUserProfile();

      dispatch(
        loginUserAction({
          token,
          user: profile,
        })
      );

      // 🔑 IMPORTANT: expiry-based logout (NO RESET ON REFRESH)
      const remainingTime = expiryTime - Date.now();
      setTimeout(() => {
        handleLogout();
      }, remainingTime);

      toast.success("Login successful!");
      toast.info("Session will expire automatically in 1 hour for security reasons.");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div style={{ background: "#f8f9fa", padding: "60px 0" }}>
      <div className="container d-flex justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-lg border-0 rounded-4 p-4">
            <h3 className="text-center fw-bold mb-4 text-danger">
              Sign In
            </h3>

            <form onSubmit={handleLoginSubmit}>
              <input
                type="email"
                className="form-control mb-3 rounded-pill"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />

              <input
                type="password"
                className="form-control mb-3 rounded-pill"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />

              <button
                type="submit"
                className="btn btn-danger w-100 rounded-pill fw-bold"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <p className="text-center mt-3">
              Don&apos;t have an account?{" "}
              <button
                className="btn btn-link p-0"
                onClick={() => navigate("/signup")}
                disabled={loading}
              >
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
