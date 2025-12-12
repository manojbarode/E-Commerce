import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./paymentSuccess.css";

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;

  if (!data) {
    return (
      <div className="success-container">
        <h2>Invalid Access</h2>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="success-container">
      <div className="success-card">
        <h2>{data.status}</h2>
        <p className="success-msg">Your transaction has been completed.</p>

        <div className="info-row">
          <span>Reference ID:</span>
          <strong>{data.publicRef}</strong>
        </div>

        <div className="info-row">
          <span>Payer Info:</span>
          <strong>{data.maskedIdentifier}</strong>
        </div>

        <div className="info-row">
          <span>Amount Paid:</span>
          <strong>{data.amount} {data.currency}</strong>
        </div>

        <div className="info-row">
          <span>Status:</span>
          <strong>{data.status.replace(/^payment\s*/i, "")}</strong>
        </div>

        <div className="info-row">
          <span>Date:</span>
          <strong>{new Date(data.createdAt).toLocaleString()}</strong>
        </div>

        <button className="home-btn" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </div>
  );
}
