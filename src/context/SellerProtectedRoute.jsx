import { Navigate } from "react-router-dom";

const SellerProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("sellerToken");

  if (!token) {
    return <Navigate to="/seller" replace />;
  }

  return children;
};

export default SellerProtectedRoute;
