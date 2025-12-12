import React, { useContext, useEffect, useState } from "react";
import "./Payment.css";
import { getPaymentMethods, getPaymentFields, submitPayment } from "../api/paymentApi";
import { FaCreditCard, FaPaypal, FaMobileAlt } from "react-icons/fa";
import { PaymentContext } from "../context/PaymentProvider";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function PaymentForm() {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethodId, setSelectedMethodId] = useState(null);
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [currency, setCurrency] = useState("INR");
  const [amount, setAmount] = useState();
  const { price, productUid } = useContext(PaymentContext);
  const navigate = useNavigate();
  const [paymentInProgress, setPaymentInProgress] = useState(false);

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const methods = await getPaymentMethods();
        const methodsWithIcons = methods.map((m) => ({
          ...m,
          icon:
            m.type === "card" ? <FaCreditCard /> :
            m.type === "upi" ? <FaMobileAlt /> :
            m.type === "paypal" ? <FaPaypal /> :
            <FaCreditCard />,
        }));
        setPaymentMethods(methodsWithIcons);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load payment methods");
      }
    };
    fetchMethods();
  }, []);

  useEffect(() => {
    if (price) setAmount(price);
  }, [price]);

  const handleMethodClick = async (methodId) => {
    setSelectedMethodId(methodId);
    setFormData({});
    try {
      const methodFields = await getPaymentFields(methodId);
      setFields(methodFields);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load fields for this method");
      setFields([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (paymentInProgress) return;

    if (!selectedMethodId) {
      toast.info("Please select a payment method");
      return;
    }

    setPaymentInProgress(true);

    const payload = {paymentMethodId: selectedMethodId,amount: amount,currency: currency,
      customFields: formData || {},productUid: productUid,
    };

    try {
      const response = await submitPayment(payload);

      if (response && response.status === 202) {
        // toast.success(`Payment successful!`);
        navigate("/payment-success", {
        state: response.data
      });
        // setFormData({});
        // setSelectedMethodId(null);
        // setFields([]);
      } else {
        toast.error("Payment failed: " + (response.message || "Please try again."));
      }
    } catch (err) {
      toast.error("Payment request failed. Please try again.");
    } finally {
      setPaymentInProgress(false);
    }
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
          <div className="form-group">
            <label>Amount</label>
            <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))}
              min="1"required readOnly/>
          </div>

          <div className="form-group">
            <label>Currency</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>

          {fields.map((field) => (
            <div className="form-group" key={field.name}>
              <label>{field.label}</label>
              <input type={field.type || "text"} name={field.name}placeholder={field.placeholder || ""}
                value={formData[field.name] || ""}onChange={handleChange}required={field.required}
                maxLength={field.maxLength || undefined}
              />
            </div>
          ))}
        </div>
      )}

      <button className="submit-btn" onClick={handleSubmit} disabled={paymentInProgress}>
        {paymentInProgress ? "Processing..." : "Complete Payment"}
      </button>
    </div>
  );
}
