import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

import { loginUser as apiLoginUser } from "../../api/authApi";
import { loginUser } from "../../Redux/authSlice";
import { setBuyerUid } from "../../Redux/orderSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await apiLoginUser({ email, password });

      if (!res?.token) {
        toast.error("Login failed");
        return;
      }

      dispatch(
        loginUser({
          token: res.token,
          user: {
            userUid: res.userUid,
            name: res.name,
            email: res.email,
          },
        })
      );

      dispatch(setBuyerUid(res.userUid));

      toast.success("Login successful");
      navigate("/");
    } catch (err) {
      toast.error(err?.message || "Invalid email or password");
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
                required
              />

              <input
                type="password"
                className="form-control mb-3 rounded-pill"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="submit"
                className="btn btn-danger w-100 rounded-pill fw-bold"
              >
                Sign In
              </button>
            </form>

            <p className="text-center mt-3">
              Don't have an account?{" "}
              <button
                className="btn btn-link p-0"
                onClick={() => navigate("/signup")}
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
