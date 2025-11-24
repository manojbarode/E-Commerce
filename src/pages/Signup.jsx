import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");

  const toggleForm = () => setIsSignUp(!isSignUp);

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    console.log("Sign In submitted");
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    console.log("Sign Up submitted with Name:", name);
  };

  // Name input change handler - only letters allowed
  const handleNameChange = (e) => {
    const value = e.target.value;
    const lettersOnly = value.replace(/[^a-zA-Z ]/g, ""); // remove numbers & special chars
    setName(lettersOnly);
  };

  return (
    <div className="container py-5">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      />
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="text-center mb-4">{isSignUp ? "Sign Up" : "Sign In"}</h2>

              <div className="d-flex justify-content-center mb-3">
                <a href="#" className="btn btn-outline-primary mx-1">
                  <i className="fa fa-facebook"></i>
                </a>
                <a href="#" className="btn btn-outline-danger mx-1">
                  <i className="fa fa-google-plus"></i>
                </a>
                <a href="#" className="btn btn-outline-primary mx-1">
                  <i className="fa fa-linkedin"></i>
                </a>
              </div>
              <p className="text-center mb-4">
                {isSignUp ? "or use your email for registration" : "or use your account"}
              </p>

              <form onSubmit={isSignUp ? handleSignUpSubmit : handleSignInSubmit}>
                {isSignUp && (
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Name"
                      value={name}
                      onChange={handleNameChange}
                      required
                    />
                  </div>
                )}
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    required
                  />
                </div>
                <div className="d-grid mb-3">
                  <button type="submit" className="btn btn-danger">
                    {isSignUp ? "Sign Up" : "Sign In"}
                  </button>
                </div>
              </form>

              <p className="text-center">
                {isSignUp
                  ? "Already have an account? "
                  : "Don't have an account? "}
                <button className="btn btn-link p-0" onClick={toggleForm}>
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
