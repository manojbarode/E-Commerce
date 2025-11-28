import React from "react";

export default function StatsCard({ title, value, icon, color }) {
  return (
    <div className="col-md-3">
      <div className={`card shadow-sm p-3 rounded-4 text-white ${color}`}>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h6>{title}</h6>
            <h3 className="fw-bold">{value}</h3>
          </div>
          <i className={`bi ${icon} fs-1`}></i>
        </div>
      </div>
    </div>
  );
}
