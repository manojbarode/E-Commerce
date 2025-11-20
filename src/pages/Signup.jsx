import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Signup() {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    loginUser(); // signup ke baad login
    navigate("/");
  };

  return (
    <div className="container mt-5">
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <div className="mb-3">
          <input type="text" placeholder="Name" className="form-control" required />
        </div>
        <div className="mb-3">
          <input type="email" placeholder="Email" className="form-control" required />
        </div>
        <div className="mb-3">
          <input type="password" placeholder="Password" className="form-control" required />
        </div>
        <button type="submit" className="btn btn-success">Signup</button>
      </form>
    </div>
  );
}
