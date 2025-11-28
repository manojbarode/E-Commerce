import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar bg-dark text-white d-flex flex-column p-3">
      <h3 className="mb-4 text-center fw-bold">Admin Panel</h3>
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <Link className="nav-link text-white" to="/admin/dashboard">Dashboard</Link>
        </li>
        <li className="nav-item mb-2">
          <Link className="nav-link text-white" to="/admin/products">Products</Link>
        </li>
        <li className="nav-item mb-2">
          <Link className="nav-link text-white" to="/admin/sellers">Sellers</Link>
        </li>
        <li className="nav-item mb-2">
          <Link className="nav-link text-white" to="/admin/orders">Orders</Link>
        </li>
      </ul>
    </div>
  );
}
