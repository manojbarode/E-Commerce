import React, { useState, useContext } from "react";
import { loginUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const { loginUser: setLoginUser } = useContext(AuthContext);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const data = await loginUser({ email, password });

      if (data?.token) {
        setLoginUser(data.token, data.user);
        
      }

      setMessage("Login successful! Redirecting...");
      setTimeout(() => navigate("/"), 100);
    } catch (err) {
      setMessage("Invalid email or password.");
    }
  };

  return (
    <div style={{ background: "#f8f9fa", padding: "60px 0" }}>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      />

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

            {message && (
              <p className={`text-center ${message.includes("successful") ? "text-success" : "text-danger"}`}>
                {message}
              </p>
            )}

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
              Don’t have an account?{" "}
              <button className="btn btn-link p-0 fw-semibold" onClick={() => navigate("/signup")}>
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
