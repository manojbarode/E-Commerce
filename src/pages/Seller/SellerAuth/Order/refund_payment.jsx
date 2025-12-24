import React, { useState } from "react";
import {
  FaArrowLeft,
  FaCreditCard,
  FaMoneyBillWave,
  FaUniversity,
  FaChevronRight,
} from "react-icons/fa";

const refundIssues = [
  {
    id: 1,
    title: "Refund status",
    icon: FaMoneyBillWave,
    content: "Enter your order ID to check refund status.",
  },
  {
    id: 2,
    title: "Payment failed but amount deducted",
    icon: FaCreditCard,
    content:
      "If payment failed but amount deducted, refund will be processed automatically within 3–5 working days.",
  },
  {
    id: 3,
    title: "EMI options",
    icon: FaCreditCard,
    content:
      "You can convert eligible purchases into EMI or manage existing EMI payments.",
  },
  {
    id: 4,
    title: "Refund to bank account",
    icon: FaUniversity,
    content:
      "Please provide your bank details to receive the refund directly to your account.",
  },
];

const RefundPayment = () => {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ minHeight: "100vh", background: "#f1f3f6" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #198754 0%, #3d4be9ff 100%)",
          color: "#fff",
          padding: "32px 24px",
          boxShadow: "0 4px 12px rgba(25, 135, 84, 0.2)",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ margin: 0, fontWeight: "700", fontSize: "28px" }}>
            Payment & Refund Help
          </h2>
          <p style={{ margin: "8px 0 0 0", fontSize: "15px", opacity: 0.95 }}>
            Get help related to refunds & EMI payments
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 20px" }}>
        {!selectedIssue ? (
          /* ================= LIST VIEW ================= */
          <div
            style={{
              background: "#fff",
              padding: "28px",
              borderRadius: "12px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            }}
          >
            <h4
              style={{
                marginBottom: "8px",
                fontWeight: "700",
                fontSize: "22px",
                color: "#212529",
              }}
            >
              Select a topic
            </h4>
            <p
              style={{
                color: "#6c757d",
                marginBottom: "24px",
                fontSize: "15px",
              }}
            >
              Choose an issue to see detailed information
            </p>

            <div>
              {refundIssues.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedIssue(item)}
                  onMouseEnter={() => setHovered(item.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    padding: "18px 20px",
                    marginBottom: "12px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    border:
                      hovered === item.id
                        ? "2px solid #198754"
                        : "1px solid #e3e6ea",
                    background: hovered === item.id ? "#f0fdf4" : "#fff",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "all 0.3s ease",
                    boxShadow:
                      hovered === item.id
                        ? "0 4px 12px rgba(25, 135, 84, 0.15)"
                        : "0 1px 3px rgba(0,0,0,0.05)",
                    transform: hovered === item.id ? "translateY(-2px)" : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "14px",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "10px",
                        background:
                          hovered === item.id
                            ? "linear-gradient(135deg, #198754, #20c997)"
                            : "#e8f5e9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {React.createElement(item.icon, {
                        size: 20,
                        color: hovered === item.id ? "#fff" : "#198754",
                      })}
                    </div>
                    <span
                      style={{
                        fontWeight: "600",
                        fontSize: "16px",
                        color: "#212529",
                      }}
                    >
                      {item.title}
                    </span>
                  </div>
                  <FaChevronRight
                    size={16}
                    color={hovered === item.id ? "#198754" : "#adb5bd"}
                    style={{ transition: "all 0.3s ease" }}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ================= DETAIL VIEW ================= */
          <div
            style={{
              background: "#fff",
              padding: "28px",
              borderRadius: "12px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            }}
          >
            <button
              onClick={() => setSelectedIssue(null)}
              style={{
                border: "none",
                background: "transparent",
                color: "#198754",
                fontSize: "15px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "24px",
                padding: "8px 12px",
                borderRadius: "8px",
                fontWeight: "600",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#f0fdf4";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <FaArrowLeft size={14} /> Back to all topics
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #198754, #20c997)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(25, 135, 84, 0.25)",
                }}
              >
                {React.createElement(selectedIssue.icon, {
                  size: 26,
                  color: "#fff",
                })}
              </div>
              <h4
                style={{
                  fontWeight: "700",
                  margin: 0,
                  fontSize: "24px",
                  color: "#212529",
                }}
              >
                {selectedIssue.title}
              </h4>
            </div>

            <p
              style={{
                color: "#495057",
                marginBottom: "28px",
                fontSize: "15px",
                lineHeight: "1.6",
              }}
            >
              {selectedIssue.content}
            </p>

            {/* ================= REFUND STATUS ================= */}
            {selectedIssue.id === 1 && (
              <div
                style={{
                  background: "#f8f9fa",
                  padding: "24px",
                  borderRadius: "10px",
                  border: "1px solid #e3e6ea",
                }}
              >
                <label
                  style={{
                    display: "block",
                    marginBottom: "10px",
                    fontWeight: "600",
                    color: "#212529",
                    fontSize: "14px",
                  }}
                >
                  Order ID
                </label>
                <input
                  type="text"
                  placeholder="Enter Order ID"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #ced4da",
                    borderRadius: "8px",
                    fontSize: "15px",
                    marginBottom: "16px",
                    transition: "all 0.2s ease",
                    outline: "none",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#198754";
                    e.target.style.boxShadow = "0 0 0 3px rgba(25, 135, 84, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#ced4da";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: "linear-gradient(135deg, #198754, #20c997)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 12px rgba(25, 135, 84, 0.3)",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 16px rgba(25, 135, 84, 0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(25, 135, 84, 0.3)";
                  }}
                >
                  Check Refund Status
                </button>
              </div>
            )}

            {/* ================= PAYMENT FAILED ================= */}
            {selectedIssue.id === 2 && (
              <div
                style={{
                  background: "#fff3cd",
                  padding: "20px",
                  borderRadius: "10px",
                  border: "1px solid #ffc107",
                  borderLeft: "4px solid #ffc107",
                }}
              >
                <h5
                  style={{
                    fontWeight: "700",
                    marginBottom: "12px",
                    color: "#856404",
                    fontSize: "16px",
                  }}
                >
                  ℹ️ Important Information
                </h5>
                <p style={{ margin: 0, color: "#856404", lineHeight: "1.6" }}>
                  If your payment failed but the amount was deducted, please don't worry. 
                  The refund will be processed automatically within 3-5 working days. 
                  The amount will be credited back to your original payment method.
                </p>
              </div>
            )}

            {/* ================= EMI OPTIONS ================= */}
            {selectedIssue.id === 3 && (
              <div
                style={{
                  background: "#f8f9fa",
                  padding: "24px",
                  borderRadius: "10px",
                  border: "1px solid #e3e6ea",
                }}
              >
                <h5
                  style={{
                    fontWeight: "700",
                    marginBottom: "16px",
                    color: "#212529",
                    fontSize: "18px",
                  }}
                >
                  EMI Options
                </h5>

                <ul
                  style={{
                    color: "#495057",
                    marginBottom: "20px",
                    paddingLeft: "20px",
                    lineHeight: "1.8",
                  }}
                >
                  <li>Convert eligible orders into EMI</li>
                  <li>No-cost EMI available on selected banks</li>
                  <li>EMI tenure: 3, 6, 9 & 12 months</li>
                  <li>Supported credit & debit cards</li>
                </ul>

                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#212529",
                    fontSize: "14px",
                  }}
                >
                  Order ID
                </label>
                <input
                  type="text"
                  placeholder="Enter Order ID"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #ced4da",
                    borderRadius: "8px",
                    fontSize: "15px",
                    marginBottom: "16px",
                    outline: "none",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#198754";
                    e.target.style.boxShadow = "0 0 0 3px rgba(25, 135, 84, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#ced4da";
                    e.target.style.boxShadow = "none";
                  }}
                />

                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#212529",
                    fontSize: "14px",
                  }}
                >
                  EMI Duration
                </label>
                <select
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #ced4da",
                    borderRadius: "8px",
                    fontSize: "15px",
                    marginBottom: "16px",
                    background: "#fff",
                    cursor: "pointer",
                    outline: "none",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#198754";
                    e.target.style.boxShadow = "0 0 0 3px rgba(25, 135, 84, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#ced4da";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  <option>Select EMI Duration</option>
                  <option>3 Months</option>
                  <option>6 Months</option>
                  <option>9 Months</option>
                  <option>12 Months</option>
                </select>

                <button
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: "linear-gradient(135deg, #198754, #20c997)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 12px rgba(25, 135, 84, 0.3)",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 16px rgba(25, 135, 84, 0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(25, 135, 84, 0.3)";
                  }}
                >
                  Check EMI Eligibility
                </button>
              </div>
            )}

            {/* ================= BANK REFUND ================= */}
            {selectedIssue.id === 4 && (
              <div
                style={{
                  background: "#f8f9fa",
                  padding: "24px",
                  borderRadius: "10px",
                  border: "1px solid #e3e6ea",
                }}
              >
                <h5
                  style={{
                    fontWeight: "700",
                    marginBottom: "20px",
                    color: "#212529",
                    fontSize: "18px",
                  }}
                >
                  Bank Account Details
                </h5>

                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#212529",
                      fontSize: "14px",
                    }}
                  >
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter account holder name"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "1px solid #ced4da",
                      borderRadius: "8px",
                      fontSize: "15px",
                      outline: "none",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#198754";
                      e.target.style.boxShadow = "0 0 0 3px rgba(25, 135, 84, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#ced4da";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#212529",
                      fontSize: "14px",
                    }}
                  >
                    Bank Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter bank name"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "1px solid #ced4da",
                      borderRadius: "8px",
                      fontSize: "15px",
                      outline: "none",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#198754";
                      e.target.style.boxShadow = "0 0 0 3px rgba(25, 135, 84, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#ced4da";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#212529",
                      fontSize: "14px",
                    }}
                  >
                    Account Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter account number"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "1px solid #ced4da",
                      borderRadius: "8px",
                      fontSize: "15px",
                      outline: "none",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#198754";
                      e.target.style.boxShadow = "0 0 0 3px rgba(25, 135, 84, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#ced4da";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#212529",
                      fontSize: "14px",
                    }}
                  >
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    placeholder="Enter IFSC code"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "1px solid #ced4da",
                      borderRadius: "8px",
                      fontSize: "15px",
                      outline: "none",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#198754";
                      e.target.style.boxShadow = "0 0 0 3px rgba(25, 135, 84, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#ced4da";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <button
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: "linear-gradient(135deg, #198754, #20c997)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 12px rgba(25, 135, 84, 0.3)",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 16px rgba(25, 135, 84, 0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(25, 135, 84, 0.3)";
                  }}
                >
                  Submit Bank Details
                </button>
              </div>
            )}

            {/* ================= SUPPORT ================= */}
            <div
              style={{
                marginTop: "28px",
                background: "linear-gradient(135deg, #e7f3ff, #f0f9ff)",
                padding: "20px",
                borderRadius: "10px",
                borderLeft: "4px solid #198754",
                boxShadow: "0 2px 8px rgba(25, 135, 84, 0.1)",
              }}
            >
              <strong style={{ color: "#212529", fontSize: "16px" }}>
                Need more help?
              </strong>
              <p
                style={{
                  marginBottom: 0,
                  marginTop: "8px",
                  color: "#495057",
                  lineHeight: "1.6",
                }}
              >
                Contact support at{" "}
                <a
                  href="mailto:support@example.com"
                  style={{
                    color: "#198754",
                    textDecoration: "none",
                    fontWeight: "600",
                  }}
                >
                  support@example.com
                </a>{" "}
                or call{" "}
                <a
                  href="tel:+918889174066"
                  style={{
                    color: "#198754",
                    textDecoration: "none",
                    fontWeight: "600",
                  }}
                >
                  +91 8889174066
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RefundPayment;