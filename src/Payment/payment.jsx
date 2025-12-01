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
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">

            <div className="card border-0 shadow-lg" style={{ borderRadius: "20px" }}>
              <div className="card-body p-4 p-md-5">

                <div className="text-center">
  <h4
    className="fw-bold mb-4"
    style={{
      whiteSpace: "nowrap",
      fontSize: "clamp(20px, 4vw, 26px)", // auto responsive text size
    }}
  >
    Choose Payment Method
  </h4>
                  <div className="row g-3">
                    {paymentOptions.map((option) => (
                      <div className="col-6" key={option.value}>
                        <div
                          className={`card h-100 border-0 shadow-sm ${
                            paymentMethod === option.value ? "border-primary" : ""
                          }`}
                          style={{
                            cursor: "pointer",
                            borderRadius: "15px",
                            transition: "all 0.3s ease",
                            border: paymentMethod === option.value ? "3px solid #667eea" : "none",
                            transform: paymentMethod === option.value ? "scale(1.05)" : "scale(1)",
                          }}
                          onClick={() => setPaymentMethod(option.value)}
                        >
                          <div className="card-body text-center p-3">
                            <div
                              className="d-flex align-items-center justify-content-center mb-2"
                              style={{
                                width: "50px",
                                height: "50px",
                                margin: "0 auto",
                                background: option.gradient,
                                borderRadius: "12px",
                                fontSize: "1.5rem",
                              }}
                            >
                              {option.icon}
                            </div>
                            <small className="fw-semibold">{option.label}</small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Form Fields */}
                  {paymentMethod && (
                    <div
                      style={{
                        animation: "fadeIn 0.5s ease-in",
                        background: "#f8f9fa",
                        padding: "20px",
                        borderRadius: "15px",
                        marginTop: "25px",
                        marginBottom: "20px",
                      }}
                    >
                      <style>
                        {`
                          @keyframes fadeIn {
                            from { opacity: 0; transform: translateY(-10px); }
                            to { opacity: 1; transform: translateY(0); }
                          }
                        `}
                      </style>

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
                            style={{ borderRadius: "10px" }}
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
                              maxLength="19"
                              style={{ borderRadius: "10px" }}
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
                              style={{ borderRadius: "10px" }}
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
                                maxLength="2"
                                style={{ borderRadius: "10px" }}
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
                                maxLength="4"
                                style={{ borderRadius: "10px" }}
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
                                maxLength="3"
                                style={{ borderRadius: "10px" }}
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {paymentMethod === "cod" && (
                        <div className="text-center py-4">
                          <div className="display-1 mb-3">💵</div>
                          <h5 className="text-muted">Pay with cash on delivery</h5>
                          <p className="text-muted small mb-0">No additional charges</p>
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
                       marginTop: "20px",
                    }}
                  >
                    🔒 Complete Payment
                  </button>

                  <small className="text-muted d-block mt-3">🔐 Your payment is secure and encrypted</small>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
