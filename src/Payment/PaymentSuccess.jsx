import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./paymentSuccess.css";

export default function PaymentSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="success-container">
        <h2>Invalid Access</h2>
        <button className="home-btn" onClick={() => navigate("/")}>
          Go Home
        </button>
      </div>
    );
  }
  const orderData = state.data || state;

  const {orderUid,productTitle,productImageUrls,quantity,totalAmount,currency,paymentPublicRef,paymentMethod,
    paymentStatus,maskIdentifier,orderStatus,orderDate,} = orderData;

  return (
    <div className="success-container">
      <div className="success-card">

        <h2 className="success-title">Order Confirmed</h2>
        <p className="success-msg">
          Thank you! Your order has been placed successfully.
        </p>

        {productImageUrls?.length > 0 && (
          <img src={productImageUrls[0]} alt={productTitle || "product"} className="success-product-img"/>)}

        <div className="info-row">
          <span>Order ID:</span>
          <strong>{orderUid || "N/A"}</strong>
        </div>

        <div className="info-row">
          <span>Product:</span>
          <strong>{productTitle || "N/A"}</strong>
        </div>

        <div className="info-row">
          <span>Quantity:</span>
          <strong>{quantity || 0}</strong>
        </div>

        <div className="info-row">
          <span>Total Paid:</span>
          <strong>
            {totalAmount || 0} {currency || "INR"}
          </strong>
        </div>

        <div className="info-row">
          <span>Payment Method:</span>
          <strong>{paymentMethod || "N/A"}</strong>
        </div>

        {paymentPublicRef && (
          <div className="info-row">
            <span>Payment Ref:</span>
            <strong>{paymentPublicRef}</strong>
          </div>
        )}

        {maskIdentifier && (
          <div className="info-row">
            <span>Payer Info:</span>
            <strong>{maskIdentifier}</strong>
          </div>
        )}

        <div className="info-row">
          <span>Payment Status:</span>
          <strong
            className={
              paymentStatus?.toUpperCase() === "SUCCESS"
                ? "status-success"
                : "status-failed"
            }
          >
            {paymentStatus || "N/A"}
          </strong>
        </div>

        <div className="info-row">
          <span>Order Status:</span>
          <strong>{orderStatus || "N/A"}</strong>
        </div>

        <div className="info-row">
          <span>Order Date:</span>
          <strong>
            {orderDate ? new Date(orderDate).toLocaleString() : "N/A"}
          </strong>
        </div>

        <button className="home-btn" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </div>
  );
}
