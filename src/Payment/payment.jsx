import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function PaymentForm() {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expMonth: "",
    expYear: "",
    cvv: "",
    upiId: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }
    console.log("Payment Data:", { paymentMethod, ...formData });
    alert("Payment Submitted Successfully!");
  };

  const paymentOptions = [
    { value: "credit", label: "Credit Card", icon: "💳", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
    { value: "debit", label: "Debit Card", icon: "💳", gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
    { value: "upi", label: "UPI", icon: "📱", gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
    { value: "cod", label: "Cash on Delivery", icon: "💵", gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "40px 20px",
      }}
    >
      <style>{`
        .payment-card { transition: all 0.3s ease; }
        .payment-card:hover { transform: scale(1.04); box-shadow: 0 6px 15px rgba(0,0,0,0.15); }
        .selected-payment {
          border: 3px solid #667eea !important;
          transform: scale(1.07);
          box-shadow: 0 0 18px rgba(102,126,234,0.6);
        }
      `}</style>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="card border-0 shadow-lg" style={{ borderRadius: "20px" }}>
              <div className="card-body p-4 p-md-5">
                <div className="text-center">
                  <h4 className="fw-bold mb-4" style={{ fontSize: "clamp(20px, 4vw, 26px)" }}>
                    Choose Payment Method
                  </h4>

                  {/* Payment Selection Cards */}
                  <div className="row g-3">
                    {paymentOptions.map((option) => (
                      <div className="col-6" key={option.value}>
                        <div
                          className={`card h-100 border-0 shadow-sm position-relative payment-card ${
                            paymentMethod === option.value ? "selected-payment" : ""
                          }`}
                          style={{
                            cursor: "pointer",
                            borderRadius: "15px",
                          }}
                          onClick={() => setPaymentMethod(option.value)}
                        >
                          {paymentMethod === option.value && (
                            <div
                              style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                background: "#28a745",
                                color: "#fff",
                                borderRadius: "50%",
                                width: "24px",
                                height: "24px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontSize: "14px",
                                fontWeight: "bold",
                              }}
                            >
                              ✓
                            </div>
                          )}

                          <div className="card-body text-center p-3">
                            <div
                              className="d-flex align-items-center justify-content-center mb-2"
                              style={{
                                width: "55px",
                                height: "55px",
                                margin: "0 auto",
                                background: option.gradient,
                                borderRadius: "14px",
                                fontSize: "1.8rem",
                              }}
                            >
                              {option.icon}
                            </div>
                            <small className="fw-bold">{option.label}</small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Form area */}
                  {paymentMethod && (
                    <div
                      style={{
                        animation: "fadeIn 0.5s",
                        background: "#f8f9fa",
                        padding: "20px",
                        borderRadius: "15px",
                        marginTop: "25px",
                        marginBottom: "20px",
                      }}
                    >
                      {paymentMethod === "upi" && (
                        <div className="mb-3">
                          <label className="form-label fw-semibold">📱 UPI ID</label>
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            name="upiId"
                            placeholder="yourname@upi"
                            value={formData.upiId}
                            onChange={handleChange}
                          />
                        </div>
                      )}

                      {(paymentMethod === "credit" || paymentMethod === "debit") && (
                        <>
                          <div className="mb-3">
                            <label className="form-label fw-semibold">💳 Card Number</label>
                            <input
                              type="text"
                              className="form-control form-control-lg"
                              name="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              value={formData.cardNumber}
                              onChange={handleChange}
                              maxLength={19}
                            />
                          </div>

                          <div className="mb-3">
                            <label className="form-label fw-semibold">👤 Cardholder Name</label>
                            <input
                              type="text"
                              className="form-control form-control-lg"
                              name="cardName"
                              placeholder="John Doe"
                              value={formData.cardName}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="row g-3">
                            <div className="col-4">
                              <label className="form-label fw-semibold">Month</label>
                              <input
                                type="text"
                                className="form-control form-control-lg"
                                name="expMonth"
                                placeholder="MM"
                                value={formData.expMonth}
                                onChange={handleChange}
                                maxLength={2}
                              />
                            </div>

                            <div className="col-4">
                              <label className="form-label fw-semibold">Year</label>
                              <input
                                type="text"
                                className="form-control form-control-lg"
                                name="expYear"
                                placeholder="YYYY"
                                value={formData.expYear}
                                onChange={handleChange}
                                maxLength={4}
                              />
                            </div>

                            <div className="col-4">
                              <label className="form-label fw-semibold">CVV</label>
                              <input
                                type="password"
                                className="form-control form-control-lg"
                                name="cvv"
                                placeholder="•••"
                                value={formData.cvv}
                                onChange={handleChange}
                                maxLength={3}
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {paymentMethod === "cod" && (
                        <div className="text-center py-4">
                          <div className="display-1 mb-3">💵</div>
                          <h5 className="fw-bold">Cash on Delivery</h5>
                          <p className="text-muted small mb-0">No extra charges</p>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    className="btn btn-lg w-100 text-white fw-bold shadow"
                    onClick={handleSubmit}
                    style={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      borderRadius: "12px",
                      padding: "15px",
                      fontSize: "1.1rem",
                    }}
                  >
                    🔒 Complete Payment
                  </button>

                  <small className="text-muted d-block mt-3">🔐 Your payment is 100% secure</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
