import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

import { loginUser as loginApi, fetchUserProfile } from "../../api/authApi";
import { loginUser as loginUserAction } from "../../Redux/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;


    // Basic validation
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);

   try {
  console.log("🔐 Logging in with:", email);
  const res = await loginApi({ email, password });

  const token = res.token;
  if (!token) {
    throw new Error("Token not received from server");
  }
  sessionStorage.setItem("token", token);
  console.log("✅ Token stored:", token);
  console.log("👤 Fetching user profile...");
  const profile = await fetchUserProfile();
  console.log("✅ Profile fetched:", profile);

  dispatch(
    loginUserAction({
      token,
      user: profile,
    })
  );
  sessionStorage.setItem("user", JSON.stringify(profile));

  toast.success("Login successful!");
  navigate("/");

} catch (err) {
  console.error("❌ Login failed:", err);
  toast.error(err.response?.data?.message || err.message || "Login failed");
} finally {
  setLoading(false);
}

  };

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
                required
              />

              <input
                type="password"
                className="form-control mb-3 rounded-pill"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
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
