import React from "react";
import "../Css/SellerStatsCard.css";

export default function SellerStatsCard({ title, value, icon, color }) {
  const colors = {
    primary: {
      gradient: "bg-primary-gradient",
      text: "text-primary"
    },
    warning: {
      gradient: "bg-warning-gradient",
      text: "text-warning"
    },
    success: {
      gradient: "bg-success-gradient",
      text: "text-success"
    }
  };

  const theme = colors[color] || colors["primary"];

  return (
    <div className="stats-card card shadow-sm border-0 h-100">

      {/* Top Line */}
      <div className={`stats-top-line ${theme.gradient}`}></div>

      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">

          <div>
            <p className="text-uppercase small text-muted fw-semibold mb-1">
              {title}
            </p>

            <h3 className="fw-bold mb-0 stats-value">{value}</h3>
          </div>

          <div className={`stats-icon d-flex align-items-center justify-content-center ${theme.gradient}`}>
            <i className={`bi ${icon} text-white`}></i>
          </div>
        </div>

        {/* Footer */}
        <div className={`stats-footer d-flex align-items-center gap-2 ${theme.text}`}>
          <i className="bi bi-arrow-up-right"></i>
          <span>View Details</span>
        </div>
      </div>
    </div>
  );
}
