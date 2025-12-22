import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaStore,
  FaBox,
  FaShoppingCart,
  FaMoneyBill,
} from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="admin-sidebar">
      <h4 className="text-white text-center py-3">Admin Panel</h4>

      <NavLink to="/admin/dashboard" className="nav-link">
        <FaTachometerAlt /> Dashboard
      </NavLink>

      <NavLink to="/admin/users" className="nav-link">
        <FaUsers /> Users
      </NavLink>

      <NavLink to="/admin/sellers" className="nav-link">
        <FaStore /> Sellers
      </NavLink>

      <NavLink to="/admin/products" className="nav-link">
        <FaBox /> Products
      </NavLink>

      <NavLink to="/admin/orders" className="nav-link">
        <FaShoppingCart /> Orders
      </NavLink>

      <NavLink to="/admin/payments" className="nav-link">
        <FaMoneyBill /> Payments
      </NavLink>
    </div>
  );
};

export default Sidebar;
