import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./paymentSuccess.css";

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const orderData = location.state?.data || location.state;

  /* ---------- GUARD ---------- */
  if (!orderData || !orderData.orderUid) {
    return (
      <div className="success-container">
        <div className="success-card">
          <h2>Invalid Access</h2>
          <p>No order information found.</p>
          <button className="btn-primary" onClick={() => navigate("/")}>
            Go Home
          </button>
        </div>
      </div>
    );
  }

  /* ---------- DESTRUCTURE ---------- */
  const {
    orderUid,
    orderStatus,
    paymentStatus,
    paymentMethod,
    totalAmount,
    totalQuantity,
    shippingAmount,
    currency = "INR",
    orderDate,
    items = [],
    paymentPublicRef,
    maskIdentifier,
  } = orderData;

  /* ---------- STATUS STYLES ---------- */
  const paymentClass =
    paymentStatus === "SUCCESS"
      ? "status-success"
      : paymentStatus === "PENDING"
      ? "status-pending"
      : "status-failed";

  return (
    <div className="success-container">
      <div className="success-card">

        {/* SUCCESS ICON */}
        <div className="success-icon">
          <svg viewBox="0 0 24 24" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <h2 className="success-title">Payment Successful</h2>
        <p className="success-msg">
          Your order has been placed successfully.
        </p>

        {/* ORDER INFO */}
        <div className="order-details">

          <div className="info-row">
            <span>Order ID</span>
            <strong>{orderUid}</strong>
          </div>

          <div className="info-row">
            <span>Order Date</span>
            <strong>
              {orderDate
                ? new Date(orderDate).toLocaleString("en-IN")
                : "N/A"}
            </strong>
          </div>

          <div className="info-row">
            <span>Total Items</span>
            <strong>{totalQuantity || items.length}</strong>
          </div>

          <div className="info-row">
            <span>Shipping</span>
            <strong>₹{Number(shippingAmount || 0).toFixed(2)}</strong>
          </div>

          <div className="info-row highlight">
            <span>Total Amount</span>
            <strong>
              ₹{Number(totalAmount || 0).toLocaleString()} {currency}
            </strong>
          </div>

          <div className="info-row">
            <span>Payment Method</span>
            <strong>{paymentMethod || "ONLINE"}</strong>
          </div>

          {paymentPublicRef && (
            <div className="info-row">
              <span>Payment Ref</span>
              <strong>{paymentPublicRef}</strong>
            </div>
          )}

          {maskIdentifier && (
            <div className="info-row">
              <span>Transaction ID</span>
              <strong>{maskIdentifier}</strong>
            </div>
          )}

          <div className="info-row">
            <span>Payment Status</span>
            <strong className={paymentClass}>
              {paymentStatus}
            </strong>
          </div>

          <div className="info-row">
            <span>Order Status</span>
            <strong className="status-info">
              {orderStatus || "PLACED"}
            </strong>
          </div>
        </div>

        {/* ITEMS */}
        {items.length > 0 && (
          <div className="items-section">
            <h3>Order Items</h3>

            <div className="items-list">
              {items.map((item, idx) => (
                <div key={idx} className="item-card">
                  <h5>{item.productName || "Product"}</h5>
                  <p>Quantity: {item.quantity}</p>
                  <p className="item-price">
                    ₹{Number(item.priceAtTime || 0).toFixed(2)} ×{" "}
                    {item.quantity} = ₹
                    {Number(item.itemTotal || 0).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACTIONS */}
        <div className="action-buttons">
          <button
            className="btn-secondary"
            onClick={() => navigate("/orders")}
          >
            View Orders
          </button>

          <button
            className="btn-primary"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
