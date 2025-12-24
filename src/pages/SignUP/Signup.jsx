import React, { useState } from "react";
import { signupUser } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import 'react-toastify/ReactToastify.css';

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

const handleSignupSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await signupUser({ name, email, password });
    if (res.status === 201) {
      toast.success(res.data.message);
      navigate("/login");
    }
    else {
      toast.error(res.message || "Signup failed!");
    }

  } catch (error) {
  toast.error(
    error?.response?.data?.message || "Signup failed!"
  );
}
};
  return (
    <div className="container py-5" style={{ background: "#f8f9fa" }}>
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <div className="card shadow-lg border-0 rounded-4 p-4">
            <h2 className="text-center mb-4 fw-bold" style={{ color: "#dc3545" }}>
              Sign Up
            </h2>

            <div className="d-flex justify-content-center mb-3">
              <a href="#" className="btn btn-outline-primary btn-sm mx-1 rounded-circle shadow-sm">
                <i className="fa fa-facebook"></i>
              </a>
              <a href="#" className="btn btn-outline-danger btn-sm mx-1 rounded-circle shadow-sm">
                <i className="fa fa-google-plus"></i>
              </a>
              <a href="#" className="btn btn-outline-primary btn-sm mx-1 rounded-circle shadow-sm">
                <i className="fa fa-linkedin"></i>
              </a>
            </div>
            <p className="text-center text-muted mb-4" style={{ fontSize: "0.9rem" }}>
              or use your email for registration
            </p>

            {message && <p className="text-center text-danger">{message}</p>}

            <form onSubmit={handleSignupSubmit}>
              <div className="mb-3">
                <input type="text" className="form-control form-control-sm rounded-pill shadow-sm"
                  placeholder="Name" value={name}onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z ]/g, ""))}
                  required
                />
              </div>
              <div className="mb-3">
                <input type="email" className="form-control form-control-sm rounded-pill shadow-sm"placeholder="Email"
                  value={email} onChange={(e) => setEmail(e.target.value)}required/>
              </div>
              <div className="mb-3">
                <input type="password" className="form-control form-control-sm rounded-pill shadow-sm"
                  placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
              </div>
              <div className="d-grid mb-3">
                <button type="submit" className="btn btn-danger btn-gradient shadow-sm rounded-pill fw-bold"
                  style={{ padding: "0.5rem", fontSize: "1rem" }}
                >
                  Sign Up
                </button>
              </div>
            </form>

            <p className="text-center mt-3">
              Already have an account?{" "}
              <button className="btn btn-link p-0 fw-semibold" onClick={() => navigate("/login")}>
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
