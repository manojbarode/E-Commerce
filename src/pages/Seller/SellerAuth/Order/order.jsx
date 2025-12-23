import React, { useState } from "react";
import { FaBoxOpen, FaChevronRight, FaArrowLeft, FaMapMarkerAlt, FaTruck, FaUndo, FaEdit, FaTimes } from "react-icons/fa";

const orderIssues = [
  { 
    id: 1, 
    title: "Track your order", 
    icon: FaTruck,
    content: "Enter your order number to track it."
  },
  { 
    id: 2, 
    title: "Cancel order", 
    icon: FaTimes,
    content: "Submit a request to cancel the order within 24 hours."
  },
  { 
    id: 3, 
    title: "Return or exchange items", 
    icon: FaUndo,
    content: "Items can be returned or exchanged."
  },
  { 
    id: 4, 
    title: "Manage order", 
    icon: FaEdit,
    content: "Manage your order, add or remove items."
  },
  { 
    id: 5, 
    title: "Edit shipping address", 
    icon: FaMapMarkerAlt,
    content: "The shipping address can be edited before the order is dispatched"
  },
];

const OrderIssues = () => {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [orderNumber, setOrderNumber] = useState("");
  const [trackingInfo, setTrackingInfo] = useState(null);

  const handleItemClick = (issue) => {
    setSelectedIssue(issue);
    setTrackingInfo(null);
    setOrderNumber("");
  };

  const handleBack = () => {
    setSelectedIssue(null);
    setTrackingInfo(null);
    setOrderNumber("");
  };

  const handleTrackOrder = () => {
    if (orderNumber.trim()) {
      setTrackingInfo({
        orderNumber: orderNumber,
        status: "In Transit",
        estimatedDelivery: "Dec 25, 2025",
        currentLocation: "Delhi Distribution Center"
      });
    } else {
      alert("Please enter order number");
    }
  };

  const handleCancelOrder = () => {
    if (orderNumber.trim()) {
      alert(`Cancellation request submitted for order: ${orderNumber}`);
    } else {
      alert("Please enter order number");
    }
  };

  return (
    <div style={{ padding: "40px", background: "#f5f7fa", minHeight: "100vh" }}>
      <div style={{ 
        maxWidth: "900px", 
        margin: "auto", 
        borderRadius: "12px", 
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        background: "#fff"
      }}>
        <div style={{ padding: "30px" }}>
          {!selectedIssue ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <FaBoxOpen size={28} color="#0d6efd" />
                <h3 style={{ margin: 0 }}>Order Issues</h3>
              </div>

              <p style={{ color: "#6c757d", marginTop: "8px" }}>
                Select a topic to get help
              </p>

              <div style={{ marginTop: "20px" }}>
                {orderIssues.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px",
                      borderRadius: "8px",
                      marginBottom: "10px",
                      border: hoveredItem === item.id ? "1px solid #0d6efd" : "1px solid #e0e0e0",
                      cursor: "pointer",
                      background: hoveredItem === item.id ? "#f8f9fa" : "#fff",
                      transition: "all 0.2s",
                    }}
                  >
                    <span>{item.title}</span>
                    <FaChevronRight color="#6c757d" />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={handleBack}
                style={{ 
                  padding: 0, 
                  marginBottom: "20px",
                  background: "none",
                  border: "none",
                  color: "#0d6efd",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "16px"
                }}
              >
                <FaArrowLeft /> Back to all issues
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                {React.createElement(selectedIssue.icon, { size: 32, color: "#0d6efd" })}
                <h3 style={{ margin: 0 }}>{selectedIssue.title}</h3>
              </div>

              <div style={{ background: "#f8f9fa", border: "none", padding: "20px", borderRadius: "8px" }}>
                <h5 style={{ color: "#495057", marginBottom: "15px" }}>Help & Information</h5>
                <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#6c757d" }}>
                  {selectedIssue.content}
                </p>

                {selectedIssue.id === 1 && (
                  <div style={{ marginTop: "20px" }}>
                    <input
                      type="text"
                      placeholder="Enter order number"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "6px",
                        border: "1px solid #dee2e6",
                        marginBottom: "10px",
                        fontSize: "14px"
                      }}
                    />
                    <button 
                      onClick={handleTrackOrder}
                      style={{
                        width: "100%",
                        padding: "12px",
                        background: "#0d6efd",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "16px",
                        cursor: "pointer"
                      }}
                    >
                      Track Order
                    </button>

                    {trackingInfo && (
                      <div style={{
                        marginTop: "20px",
                        padding: "20px",
                        background: "#fff",
                        borderRadius: "8px",
                        border: "1px solid #dee2e6"
                      }}>
                        <h5 style={{ color: "#198754", marginBottom: "15px" }}>Tracking Details</h5>
                        <div style={{ marginBottom: "10px" }}>
                          <strong>Order Number:</strong> {trackingInfo.orderNumber}
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                          <strong>Status:</strong> <span style={{ color: "#0d6efd" }}>{trackingInfo.status}</span>
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                          <strong>Current Location:</strong> {trackingInfo.currentLocation}
                        </div>
                        <div>
                          <strong>Estimated Delivery:</strong> {trackingInfo.estimatedDelivery}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {selectedIssue.id === 2 && (
                  <div style={{ marginTop: "20px" }}>
                    <input
                      type="text"
                      placeholder="Enter order number"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "6px",
                        border: "1px solid #dee2e6",
                        marginBottom: "10px",
                        fontSize: "14px"
                      }}
                    />
                    <button 
                      onClick={handleCancelOrder}
                      style={{
                        width: "100%",
                        padding: "12px",
                        background: "#dc3545",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "16px",
                        cursor: "pointer"
                      }}
                    >
                      Cancel Order
                    </button>
                  </div>
                )}

                {selectedIssue.id === 3 && (
                  <div style={{ marginTop: "20px" }}>
                    <p style={{ fontSize: "14px", color: "#6c757d", marginBottom: "15px" }}>
                      Return policy: The product should be in its original condition with tags and packaging intact.
                    </p>
                    <button style={{
                      width: "100%",
                      padding: "12px",
                      background: "#ffc107",
                      color: "#000",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "16px",
                      cursor: "pointer",
                      marginBottom: "10px"
                    }}>
                      Return Item
                    </button>
                    <button style={{
                      width: "100%",
                      padding: "12px",
                      background: "#0dcaf0",
                      color: "#000",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "16px",
                      cursor: "pointer"
                    }}>
                      Exchange Item
                    </button>
                  </div>
                )}

                {selectedIssue.id === 4 && (
                  <div style={{ marginTop: "20px" }}>
                    <button style={{
                      width: "100%",
                      padding: "12px",
                      background: "#fff",
                      color: "#0d6efd",
                      border: "1px solid #0d6efd",
                      borderRadius: "6px",
                      fontSize: "16px",
                      cursor: "pointer",
                      marginBottom: "10px"
                    }}>
                      View Order Details
                    </button>
                    <button style={{
                      width: "100%",
                      padding: "12px",
                      background: "#fff",
                      color: "#6c757d",
                      border: "1px solid #6c757d",
                      borderRadius: "6px",
                      fontSize: "16px",
                      cursor: "pointer"
                    }}>
                      Download Invoice
                    </button>
                  </div>
                )}

                {selectedIssue.id === 5 && (
                  <div style={{ marginTop: "20px" }}>
                    <textarea
                      placeholder="Enter new shipping address"
                      rows="4"
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "6px",
                        border: "1px solid #dee2e6",
                        marginBottom: "10px",
                        resize: "none",
                        fontSize: "14px"
                      }}
                    />
                    <button style={{
                      width: "100%",
                      padding: "12px",
                      background: "#198754",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "16px",
                      cursor: "pointer"
                    }}>
                      Update Address
                    </button>
                  </div>
                )}
              </div>

              <div style={{ 
                marginTop: "20px", 
                background: "#e7f3ff", 
                padding: "15px", 
                borderRadius: "8px", 
                borderLeft: "4px solid #0d6efd" 
              }}>
                <strong>Need more help?</strong>
                <p style={{ margin: "5px 0 0 0", color: "#495057" }}>
                  Contact our customer support at support@example.com or call 91+8889174066
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderIssues;