const { login, logoutUser } = useContext(AuthContext);
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

function handleLogout() {
  logoutUser();
  navigate("/");
}
