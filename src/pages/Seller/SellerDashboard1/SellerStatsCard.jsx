import React from "react";
import "../Css/SellerStatsCard.css";

export default function SellerStatsCard({ title, value, icon, color }) {
  return (
    <div className={`stats-card ${color} d-flex align-items-center justify-content-between p-3 shadow-sm rounded-3`}>
      <div>
        <h6 className="mb-1 text-white">{title}</h6>
        <h4 className="fw-bold text-white">{value}</h4>
      </div>
      <div className="stats-icon fs-1 text-white">
        <i className={`bi ${icon}`}></i>
      </div>
    </div>
  );
}
