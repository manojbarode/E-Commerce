import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  // input change handle
  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  // Signup button click
  function handleSignup(e) {
    e.preventDefault();

    // TODO: API request (optional)
    // const res = await axios.post("/api/signup", formData);

    // अभी के लिए सीधे loginUser call करेंगे
    loginUser(); // login state true (localStorage + context)

    navigate("/"); // home redirect
  }

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4">Signup</h2>

      <form onSubmit={handleSignup}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="form-control mb-3"
          onChange={handleChange}
          value={formData.name}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="form-control mb-3"
          onChange={handleChange}
          value={formData.email}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="form-control mb-4"
          onChange={handleChange}
          value={formData.password}
          required
        />

        <button className="btn btn-primary w-100" type="submit">
          Create Account
        </button>
      </form>
    </div>
  );
}
