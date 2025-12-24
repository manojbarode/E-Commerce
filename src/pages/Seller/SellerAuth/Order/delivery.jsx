import React, { useState } from "react";
import {
  FaArrowLeft,
  FaTruck,
  FaMapMarkerAlt,
  FaClock,
  FaExchangeAlt,
  FaChevronRight,
} from "react-icons/fa";

const deliveryIssues = [
  {
    id: 1,
    title: "Track shipment",
    icon: FaTruck,
    content: "Enter your order ID to track your shipment in real time.",
  },
  {
    id: 2,
    title: "Delivery time & charges",
    icon: FaClock,
    content:
      "Delivery time depends on your location and product availability.",
  },
  {
    id: 3,
    title: "Change delivery address",
    icon: FaMapMarkerAlt,
    content:
      "You can change the delivery address before the order is dispatched.",
  },
  {
    id: 4,
    title: "Delivery related issues",
    icon: FaExchangeAlt,
    content:
      "Facing issues like delayed delivery or damaged package? Report here.",
  },
];

const Delivery = () => {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ minHeight: "100vh", background: "#f1f3f6" }}>
      {/* HEADER */}
      <div
        style={{
          background: "linear-gradient(135deg,  #198754 0%, #3d4be9ff 100%)",
          color: "#fff",
          padding: "32px 24px",
          boxShadow: "0 4px 12px rgba(25, 135, 84, 0.2)",
        }}
      >
        <h2 className="m-0 fw-bold">Shipping & Delivery</h2>
        <p className="m-0 small">Get help with delivery & shipment</p>
      </div>

      <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 16px" }}>
        {!selectedIssue ? (
          // LIST VIEW
          <div className="bg-white p-4 rounded shadow-sm">
            <h4 className="fw-bold mb-2">Select a topic</h4>
            <p className="text-muted mb-4">
              Choose a delivery issue to get help
            </p>

            {deliveryIssues.map((item) => (
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
                <div
                  style={{ display: "flex", gap: "12px", alignItems: "center" }}
                >
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
          // DETAIL VIEW
          <div className="bg-white p-4 rounded shadow-sm">
            <button
              onClick={() => setSelectedIssue(null)}
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

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              {React.createElement(selectedIssue.icon, {
                size: 30,
                color: "#fd7e14",
              })}
              <h4 className="fw-bold m-0">{selectedIssue.title}</h4>
            </div>

            <p className="text-muted mb-4">{selectedIssue.content}</p>

            {selectedIssue.id === 1 && (
              <>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Enter Order ID"
                />
                <button className="btn btn-warning w-100 fw-bold">
                  Track Shipment
                </button>
              </>
            )}

            {selectedIssue.id === 3 && (
              <>
                <textarea
                  className="form-control mb-3"
                  rows={4}
                  placeholder="Enter new delivery address"
                />
                <button className="btn btn-warning w-100 fw-bold">
                  Update Address
                </button>
              </>
            )}

            <div
              style={{
                marginTop: "30px",
                background: "#e7f3ff",
                padding: "16px",
                borderRadius: "8px",
                borderLeft: "4px solid #fd7e14",
              }}
            >
              <strong>Need more help?</strong>
              <p className="mb-0 text-muted">
                Contact support at support@example.com or call +91 8889174066
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Delivery;
