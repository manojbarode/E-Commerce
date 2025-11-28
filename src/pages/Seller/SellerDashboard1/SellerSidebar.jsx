import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../Css/SellerSidebar.css";

export default function SellerSidebar() {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: "bi-speedometer2", path: "/seller/dashboard" },
    { name: "Products", icon: "bi-box-seam", path: "/seller/products" },
    { name: "Orders", icon: "bi-cart-check", path: "/seller/orders" },
    // { name: "Revenue", icon: "bi-currency-rupee", path: "/seller/revenue" },
    // { name: "Profile", icon: "bi-person-circle", path: "/seller/profile" },
    { name: "Logout", icon: "bi-box-arrow-right", path: "/logout" },
  ];

  return (
    <div className="seller-sidebar bg-dark text-white d-flex flex-column p-3">
      <h3 className="text-center mb-4">E-Shop Seller</h3>
      <ul className="nav flex-column">
        {menuItems.map((item, i) => (
          <li key={i} className="nav-item mb-2">
            <Link
              to={item.path}
              className={`nav-link d-flex align-items-center ${
                location.pathname === item.path ? "active" : "text-white"
              }`}
            >
              <i className={`bi ${item.icon} me-2 fs-5`}></i>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
