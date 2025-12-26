import React from "react";
import { useNavigate } from "react-router-dom";

const AdminTopbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
    navigate("/admin/login");
  };

  return (
    <header className="admin-topbar">
      <div className="topbar-left">
        <h6>Admin Dashboard</h6>
      </div>

      <div className="topbar-right">
        <span className="admin-name">👤 Admin</span>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminTopbar;
