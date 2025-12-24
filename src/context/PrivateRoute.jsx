import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isLoggedIn) {
    // toast.info("Please login to continue");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
