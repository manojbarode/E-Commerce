import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../Css/SellerSidebar.css";

export default function SellerSidebar({ isOpen, closeDrawer }) {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", icon: "bi-speedometer2", path: "/seller/dashboard" },
    { name: "Products", icon: "bi-box-seam", path: "/seller/products" },
    { name: "Orders", icon: "bi-cart-check", path: "/seller/orders" },
  ];

  const handleLogout = () => {
    navigate("/sellerlogout");
    closeDrawer();
  };

  return (
    <>
      {isOpen && (
        <div className="sidebar-overlay d-lg-none" onClick={closeDrawer}></div>
      )}

      {/* Sidebar */}
      <aside className={`seller-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header px-3 py-3 d-flex align-items-center gap-3">
          <div className="sidebar-logo d-flex align-items-center justify-content-center">
            <i className="bi bi-shop"></i>
          </div>
          <div>
            <h4 className="mb-0 text-white fw-bold">E-Shop</h4>
            <small className="text-white-50">Seller Portal</small>
          </div>

          {/* Close button mobile */}
          <button className="btn sidebar-close-btn d-lg-none" onClick={closeDrawer}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <nav className="sidebar-menu px-3 mt-3">
          <ul className="nav flex-column">
            {menuItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <li key={item.path} className="nav-item mb-2">
                  <Link to={item.path}className={`nav-link sidebar-link ${active ? "active" : ""}`}onClick={closeDrawer}>
                    <i className={`bi ${item.icon} me-3`}></i>{item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer logout */}
        <div className="sidebar-footer p-3">
          <button className="btn sidebar-logout w-100" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i>Logout
          </button>
        </div>
      </aside>
    </>
  );
}
