import { useDispatch } from "react-redux";
import { logoutUser } from "../../Redux/authSlice";
import { useNavigate } from "react-router-dom";
import { resetWishlist } from "../../Redux/wishlistSlice";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearCart());
    dispatch(resetWishlist());
    navigate("/login");
  };

  return (
    <button className="btn btn-outline-danger" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
