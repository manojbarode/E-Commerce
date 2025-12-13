import React, { useEffect, useState } from "react";
import "./Payment.css";
import {getPaymentMethods,getPaymentFields,submitPayment,} from "../api/paymentApi";
import { FaCreditCard, FaPaypal, FaMobileAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {resetOrder,setPaymentMethod,setPaymentStatus,} from "../Redux/orderSlice";
import { createOrder } from "../api/orderApi";

export default function PaymentForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethodId, setSelectedMethodId] = useState(null);
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [currency, setCurrency] = useState("INR");
  const [paymentInProgress, setPaymentInProgress] = useState(false);

  const order = useSelector((state) => state.order);
  const buyerUid = useSelector((state) => state.auth.user?.userUid);

  const productUid = useSelector((state) => state.productUid) || localStorage.getItem("productUid");
  const amount = order.totalAmount;

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const methods = await getPaymentMethods();
        const enriched = methods.map((m) => ({
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
        setPaymentMethods(enriched);
      } catch {
        toast.error("Failed to load payment methods");
      }
    };
    fetchMethods();
  }, []);

  const handleMethodClick = async (method) => {
    setSelectedMethodId(method.id);
    setFormData({});
    dispatch(setPaymentMethod(method.label));

    try {
      const methodFields = await getPaymentFields(method.id);
      setFields(methodFields);
    } catch {
      toast.error("Failed to load payment fields");
      setFields([]);
    }
  };

  /* ---------- Input Change ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------- Submit Payment ---------- */
  const handleSubmit = async () => {
    if (paymentInProgress) return;

    if (!selectedMethodId) {
      toast.info("Please select a payment method");
      return;
    }
    if (!buyerUid) {
      toast.error("Please login to continue");
      return;
    }
    if (!amount || amount <= 0) {
      toast.error("Invalid amount");
      return;
    }

    const allowedCurrencies = ["INR", "USD", "EUR", "GBP"];
    if (!allowedCurrencies.includes(currency)) {
      toast.error("Invalid currency selected");
      return;
    }

    // Required fields validation
    for (let field of fields) {
      if (field.required && !formData[field.name]) {
        toast.error(`Please fill the ${field.label} field`);
        return;
      }
    }

    // Optional: Basic format validation
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast.error("Invalid email format");
      return;
    }

    setPaymentInProgress(true);
    dispatch(setPaymentStatus("PENDING"));

    const paymentPayload = {paymentMethodId: selectedMethodId, amount, currency,customFields: formData,productUid,};

    try {
      const paymentResponse = await submitPayment(paymentPayload);

      if (paymentResponse?.status !== 202) {
        throw new Error("Payment failed");
      }

      const paymentData = paymentResponse.data;
      dispatch(setPaymentStatus("SUCCESS"));
      const orderResponse = await createOrder({sellerUid: order.sellerUid,productUid,buyerUid,
          quantity: order.quantity,totalAmount: order.totalAmount,currency,
          paymentMethod: order.paymentMethod,
        },
        paymentData.publicRef
      );

      dispatch(resetOrder());
      navigate("/payment-success", { state: orderResponse.data });
    } catch (error) {
      dispatch(setPaymentStatus("FAILED"));
      toast.error(error.response?.data?.message || error.message);
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
          <div key={method.id} className={`payment-card ${ selectedMethodId === method.id ? "selected" : ""
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
            <label>Amount</label>
            <input type="number" value={amount} readOnly />
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
              <input type={field.type || "text"} name={field.name}value={formData[field.name] || ""}
                onChange={handleChange}required={field.required}
              />
            </div>
          ))}
        </div>
      )}

      <button className="submit-btn" onClick={handleSubmit}disabled={paymentInProgress}>
        {paymentInProgress ? "Processing..." : "Complete Payment"}
      </button>
    </div>
  );
}
