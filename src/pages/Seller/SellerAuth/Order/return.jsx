import React, { useState } from "react";
import {
  FaArrowLeft,
  FaExchangeAlt,
  FaGift,
  FaCreditCard,
  FaChevronRight,
} from "react-icons/fa";

/* ================== ORIGINAL DATA (UNCHANGED) ================== */
const returnIssues = [
  {
    id: 1,
    title: "Initiate a return",
    icon: FaExchangeAlt,
    content:
      "Start the return process for your product. Select the items and reason for return.",
  },
  {
    id: 2,
    title: "Check refund status",
    icon: FaCreditCard,
    content:
      "Track your refund status for returned items and expected completion time.",
  },
  {
    id: 3,
    title: "Exchange items",
    icon: FaGift,
    content:
      "Request an exchange for a product. Select replacement options and delivery preferences.",
  },
  {
    id: 4,
    title: "Return policy details",
    icon: FaExchangeAlt,
    content:
      "Understand our return and exchange policies, eligibility, and timeframes.",
  },
];

const Return = () => {
  /* ================== ORIGINAL STATES ================== */
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [hovered, setHovered] = useState(null);

  /* ================== ADDED STATES (NO REMOVAL) ================== */
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState("");
  const [reason, setReason] = useState("");

  const simulateStatus = () => {
    setStatus("Checking status...");
    setTimeout(() => {
      const steps = [
        "Return requested",
        "Pickup scheduled",
        "Item picked up",
        "Refund initiated",
        "Refund completed",
      ];
      setStatus(steps[Math.floor(Math.random() * steps.length)]);
    }, 1500);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f1f3f6" }}>
      {/* ================= HEADER ================= */}
      <div
        style={{
          background: "linear-gradient(135deg, #198754 0%, #3d4be9ff 100%)",
          color: "#fff",
          padding: "32px 24px",
          boxShadow: "0 4px 12px rgba(25, 135, 84, 0.2)",
        }}
      >
        <h2 className="m-0 fw-bold">Returns & Exchanges</h2>
        <p className="m-0 small">Get help with returning or exchanging items</p>
      </div>

      <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 16px" }}>
        {!selectedIssue ? (
          /* ================= LIST VIEW ================= */
          <div className="bg-white p-4 rounded shadow-sm">
            <h4 className="fw-bold mb-2">Select a topic</h4>
            <p className="text-muted mb-4">Choose a returns or exchange topic</p>

            {returnIssues.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedIssue(item)}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  padding: "16px",
                  marginBottom: "12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  border:
                    hovered === item.id
                      ? "1px solid #fd7e14"
                      : "1px solid #dee2e6",
                  background: hovered === item.id ? "#fff7e6" : "#fff",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "0.2s",
                }}
              >
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  {React.createElement(item.icon, {
                    size: 22,
                    color: "#fd7e14",
                  })}
                  <span className="fw-medium">{item.title}</span>
                </div>
                <FaChevronRight color="#6c757d" />
              </div>
            ))}
          </div>
        ) : (
          /* ================= DETAIL VIEW ================= */
          <div className="bg-white p-4 rounded shadow-sm">
            <button
              onClick={() => {
                setSelectedIssue(null);
                setOrderId("");
                setStatus("");
              }}
              style={{
                border: "none",
                background: "none",
                color: "#fd7e14",
                fontSize: "16px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "20px",
              }}
            >
              <FaArrowLeft /> Back
            </button>

            <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
              {React.createElement(selectedIssue.icon, {
                size: 30,
                color: "#fd7e14",
              })}
              <h4 className="fw-bold m-0">{selectedIssue.title}</h4>
            </div>

            <p className="text-muted mb-4">{selectedIssue.content}</p>

            {/* ================= RETURN / REFUND ================= */}
            {(selectedIssue.id === 1 || selectedIssue.id === 2) && (
              <>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Enter Order ID"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                />

                {selectedIssue.id === 1 && (
                  <select
                    className="form-select mb-3"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  >
                    <option value="">Select return reason</option>
                    <option>Damaged product</option>
                    <option>Wrong item received</option>
                    <option>Quality not as expected</option>
                    <option>Changed my mind</option>
                  </select>
                )}

                <button
                  className="btn btn-warning w-100 fw-bold"
                  disabled={!orderId}
                  onClick={simulateStatus}
                >
                  {selectedIssue.id === 1
                    ? "Request Return"
                    : "Check Refund Status"}
                </button>

                {status && (
                  <div className="mt-3 alert alert-info fw-bold">
                    Status: {status}
                  </div>
                )}
              </>
            )}

            {/* ================= EXCHANGE ITEMS (FLIPKART STYLE) ================= */}
            {selectedIssue.id === 3 && (
              <>
                <select className="form-select mb-3">
                  <option value="">Select replacement item</option>
                  <option>Same item (Size / Color change)</option>
                  <option value="">Reason for exchange</option>
                  <option>Wrong size</option>
                  <option>Color mismatch</option>
                  <option>Defective item</option>
                  <option>Better option available</option>
                  <option>Different item</option>
                  <option value="">Delivery preference</option>
                  <option>Fastest available delivery</option>
                  <option>Standard delivery</option>
                  <option>Deliver after return pickup</option>
                </select>

               

                <select className="form-select mb-3">
                  <option value="">Delivery preference</option>
                  <option>Fastest available delivery</option>
                  <option>Standard delivery</option>
                  <option>Deliver after return pickup</option>
                </select>

                <div className="alert alert-secondary small mb-3">
                  Replacement will be delivered within <b>3–5 business days</b>{" "}
                  after pickup.
                </div>

                <button className="btn btn-warning w-100 fw-bold">
                  Request Exchange
                </button>
              </>
            )}

            {/* ================= INFO ================= */}
            <div
              style={{
                marginTop: "30px",
                background: "#e7f3ff",
                padding: "16px",
                borderRadius: "8px",
                borderLeft: "4px solid #fd7e14",
              }}
            >
              <strong>How returns work</strong>
              <ul className="mb-0 text-muted">
                <li>Pickup scheduled within 1–2 days</li>
                <li>Refund processed after quality check</li>
                <li>Amount credited in 3–5 business days</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Return;
