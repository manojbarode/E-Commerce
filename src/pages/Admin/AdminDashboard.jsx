import React from "react";
import CategoryManagement from "./CategoryManagement";
import SubcategoryManagement from "./SubcategoryManagement";
import { useNavigate } from "react-router-dom";
import "./Css/AdminPanel.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard container-fluid py-4">
      {/* Header */}
      <div className="admin-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <div>
          <h2 className="admin-title mb-1">🛠 Admin Control Panel</h2>
          <p className="admin-subtitle mb-0">
            Manage categories, subcategories & dynamic fields for your products.
          </p>
        </div>

        <div className="d-flex gap-2 mt-3 mt-md-0">
          <span className="badge rounded-pill bg-success-subtle text-success fw-semibold">
            Live Store
          </span>
          <span className="badge rounded-pill bg-info-subtle text-info fw-semibold">
            Super Admin
          </span>
        </div>
      </div>

      {/* Cards Layout */}
      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <CategoryManagement />
        </div>
        <div className="col-12 col-lg-8">
          <SubcategoryManagement />
        </div>
      </div>

      {/* Payment Method Button */}
      <div className="mt-4">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/admin/payment/form")}
        >
          ➕ Add Payment Method
        </button>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/admin/user")}
        >
          UserController
        </button>
      </div>
    </div>
  );
}
