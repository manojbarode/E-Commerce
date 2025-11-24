import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { login, loading } = useContext(AuthContext);

  if (!login) return <Navigate to="/signup" />;

  return children;
}
