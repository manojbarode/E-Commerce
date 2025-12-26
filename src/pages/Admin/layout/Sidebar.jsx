import React from "react";
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">
        <h4>Shopsy</h4>
        <span>Admin Panel</span>
      </div>

      <nav className="sidebar-menu">
        <NavLink to="/admin/dashboard">
          📊 Dashboard
        </NavLink>

        <NavLink to="/admin/users">
          👥 Users
        </NavLink>

        <NavLink to="/admin/orders">
          📦 Orders
        </NavLink>

        <NavLink to="/admin/products">
          🛍️ Products
        </NavLink>

        <NavLink to="/admin/payments">
          💳 Payments
        </NavLink>

        <NavLink to="/admin/reports">
          📈 Reports
        </NavLink>

        <NavLink to="/admin/settings">
          ⚙️ Settings
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
