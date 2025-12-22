import React, { useEffect, useState } from "react";
import "./Payment.css";
import {getPaymentMethods,getPaymentFields,submitPayment,} from "../api/paymentApi";
import { FaCreditCard, FaPaypal, FaMobileAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {setPaymentMethod,setPaymentStatus,} from "../Redux/orderSlice";

export default function PaymentForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  /* ---------- REQUIRED ---------- */
    
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethodId, setSelectedMethodId] = useState(null);
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [currency, setCurrency] = useState("INR");
  const [paymentInProgress, setPaymentInProgress] = useState(false);
  const [orderUid, setOrderUid] = useState(null);
  /* ---------- GUARD ---------- */
useEffect(() => {
  const uid = location.state?.orderUid || new URLSearchParams(location.search).get("orderUid");
  if (!uid) {
    toast.error("Invalid payment session");
    navigate("/");
    return;
  }
  setOrderUid(uid);
}, [location, navigate]);

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const methods = await getPaymentMethods();
        setPaymentMethods(
          methods.map((m) => ({
            ...m,
            icon:
              m.type === "card"
                ? <FaCreditCard />
                : m.type === "upi"
                ? <FaMobileAlt />
                : m.type === "paypal"
                ? <FaPaypal />
                : <FaCreditCard />,
          }))
        );
      } catch {
        toast.error("Failed to load payment methods");
      }
    };
    fetchMethods();
  }, []);

  /* ---------- METHOD SELECT ---------- */
  const handleMethodClick = async (method) => {
    setSelectedMethodId(method.id);
    setFormData({});
    dispatch(setPaymentMethod(method.label));

    try {
      const methodFields = await getPaymentFields(method.id);
      setFields(methodFields);
    } catch {
      toast.error("Failed to load payment fields");
    }
  };

  /* ---------- INPUT CHANGE ---------- */
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

  for (let field of fields) {
    if (field.required && !formData[field.name]) {
      toast.error(`Please fill ${field.label}`);
      return;
    }
  }

  setPaymentInProgress(true);
  dispatch(setPaymentStatus("PENDING"));

  try {
    const payload = {
      orderUid,
      paymentMethodId: selectedMethodId,
      currency,
      customFields: formData,
    };

    const res = await submitPayment(payload);

    if (res?.status !== 202) {
      throw new Error("Payment failed");
    }
    console.log("res"+res.data);
    dispatch(setPaymentStatus("SUCCESS"));
    navigate("/payment-success", {state: res.data});
  } catch (err) {
    dispatch(setPaymentStatus("FAILED"));
    toast.error(err.response?.data?.message || "Payment failed");
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
            className={`payment-card ${
              selectedMethodId === method.id ? "selected" : ""
            }`}
            onClick={() => handleMethodClick(method)}
          >
            <div className="payment-icon">{method.icon}</div>
            <div className="payment-label">{method.label}</div>
          </div>
        ))}
      </div>

      {fields.length > 0 && (
        <div className="payment-form">
          <div className="form-group">
            <label>Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>

          {fields.map((field) => (
            <div className="form-group" key={field.name}>
              <label>{field.label}</label>
              <input
                type={field.type || "text"}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                required={field.required}
              />
            </div>
          ))}
        </div>
      )}

      <button
        className="submit-btn"
        onClick={handleSubmit}
        disabled={paymentInProgress}
      >
        {paymentInProgress ? "Processing..." : "Complete Payment"}
      </button>
    </div>
  );
}
