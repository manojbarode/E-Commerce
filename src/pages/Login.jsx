
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();

    loginUser(); // login status update
    navigate("/"); // redirect to home
  }

  return (
    <div className="container mt-5">
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input type="text" className="form-control mb-2" placeholder="Email" />
        <input type="password" className="form-control mb-2" placeholder="Password" />
        
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
}
