import React, { useEffect, useState } from "react";
import "./Payment.css";
import { getPaymentMethods, getPaymentFields } from "../api/paymentApi";
import { FaCreditCard, FaPaypal, FaMobileAlt } from "react-icons/fa";

export default function PaymentForm() {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethodId, setSelectedMethodId] = useState(null);
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const methods = await getPaymentMethods();
        const methodsWithIcons = methods.map((m) => ({
          ...m,
          icon:
            m.type === "card"
              ? <FaCreditCard />
              : m.type === "upi"
              ? <FaMobileAlt />
              : m.type === "paypal"
              ? <FaPaypal />
              : <FaCreditCard />,
        }));
        setPaymentMethods(methodsWithIcons);
      } catch (err) {
        console.error(err);
        alert("Failed to load payment methods");
      }
    };
    fetchMethods();
  }, []);

  const handleMethodClick = async (methodId) => {
    setSelectedMethodId(methodId);
    setFormData({});
    try {
      const methodFields = await getPaymentFields(methodId);
      setFields(methodFields);
    } catch (err) {
      console.error(err);
      alert("Failed to load fields for this method");
      setFields([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!selectedMethodId) {
      alert("Please select a payment method");
      return;
    }
    console.log("Payment Data:", { methodId: selectedMethodId, fields: formData });
    alert("Payment submitted successfully!");
    setFormData({});
    setSelectedMethodId(null);
    setFields([]);
  };

  return (
    <div className="payment-container premium">
      <h2 className="title">Secure Payment</h2>
      <p className="subtitle">Choose your preferred payment method</p>

      <div className="payment-cards-container">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`payment-card ${selectedMethodId === method.id ? "selected" : ""}`}
            onClick={() => handleMethodClick(method.id)}
          >
            <div className="payment-icon">{method.icon}</div>
            <div className="payment-label">{method.label}</div>
          </div>
        ))}
      </div>

      {fields.length > 0 && (
        <div className="payment-form">
          {fields.map((field) => (
            <div className="form-group" key={field.name}>
              <label>{field.label}</label>
              <input
                type={field.type || "text"}
                name={field.name}
                placeholder={field.placeholder || ""}
                value={formData[field.name] || ""}
                onChange={handleChange}
                required={field.required}
                maxLength={field.maxLength || undefined}
              />
            </div>
          ))}
        </div>
      )}

      <button className="submit-btn" onClick={handleSubmit}>
        Complete Payment
      </button>
    </div>
  );
}
