import React, { useState } from "react";
import { loginUser as apiLoginUser } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loginUser as loginUserAction } from "../../Redux/authSlice";
import { setBuyerUid } from "../../Redux/orderSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const loginData = await apiLoginUser({ email, password });

      if (!loginData || !loginData.token) {
        toast.error("Login failed. Please try again.");
        return;
      }

      // Save user data to Redux (and sessionStorage inside the slice)
      dispatch(
        loginUserAction({
          token: loginData.token,
          user: {
            userUid: loginData.userUid,
            name: loginData.name,
            email: loginData.email,
          },
        })
      );

      dispatch(setBuyerUid(loginData.userUid));

      toast.success("Login successful!");
      setTimeout(() => navigate("/"), 500);

    } catch (err) {
      toast.error(err?.message || "Invalid email or password.");
    }
  };

  return (
    <div style={{ background: "#f8f9fa", padding: "60px 0" }}>
      <div className="container d-flex justify-content-center">
        <div className="col-md-7 col-lg-5">
          <div className="card shadow-lg border-0 rounded-4 p-4" style={{ background: "white" }}>
            <h2 className="text-center mb-4 fw-bold" style={{ color: "#dc3545" }}>
              Sign in
            </h2>

            <div className="d-flex justify-content-center mb-3">
              <a href="#" className="btn btn-outline-primary btn-sm mx-1 rounded-circle shadow-sm">
                <i className="fa fa-facebook" />
              </a>
              <a href="#" className="btn btn-outline-danger btn-sm mx-1 rounded-circle shadow-sm">
                <i className="fa fa-google-plus" />
              </a>
              <a href="#" className="btn btn-outline-primary btn-sm mx-1 rounded-circle shadow-sm">
                <i className="fa fa-linkedin" />
              </a>
            </div>

            <p className="text-center text-muted mb-4" style={{ fontSize: "0.9rem" }}>
              or use your account
            </p>

            <form onSubmit={handleLoginSubmit}>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control form-control-sm rounded-pill shadow-sm"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  className="form-control form-control-sm rounded-pill shadow-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="d-grid mb-3">
                <button
                  type="submit"
                  className="btn btn-danger shadow-sm rounded-pill fw-bold"
                  style={{ padding: "0.5rem", fontSize: "1rem" }}
                >
                  Sign in
                </button>
              </div>
            </form>

            <p className="text-center mt-3">
              Don't have an account?{" "}
              <button
                className="btn btn-link p-0 fw-semibold"
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
