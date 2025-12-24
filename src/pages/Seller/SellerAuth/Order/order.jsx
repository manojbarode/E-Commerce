import React, { useState } from "react";
import { 
  FaBoxOpen, 
  FaChevronRight, 
  FaArrowLeft, 
  FaMapMarkerAlt, 
  FaTruck, 
  FaUndo, 
  FaEdit, 
  FaTimes 
} from "react-icons/fa";

const orderIssues = [
  { 
    id: 1, 
    title: "Track your order", 
    icon: FaTruck, 
    content: "Enter your order number to track your order" 
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

  const handleItemClick = (issue) => {
    setSelectedIssue(issue);
  };

  const handleBack = () => {
    setSelectedIssue(null);
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#f1f3f6", 
      padding: "0" 
    }}>
      {/* Header */}
      <div style={{ 
        background: "#0d6efd", 
        color: "#fff", 
        padding: "24px 0" 
      }}>
        <div style={{ 
          maxWidth: "1200px", 
          margin: "0 auto", 
          padding: "0 20px" 
        }}>
          <h1 style={{ 
            fontSize: "28px", 
            fontWeight: "bold", 
            margin: 0 
          }}>
            e-Help Center
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        maxWidth: "1200px", 
        margin: "0 auto", 
        padding: "40px 20px" 
      }}>
        {!selectedIssue ? (
          <>
            {/* List View */}
            <div style={{ 
              background: "#fff", 
              borderRadius: "8px", 
              padding: "24px", 
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)" 
            }}>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "12px", 
                marginBottom: "16px" 
              }}>
                <FaBoxOpen size={28} color="#0d6efd" />
                <h2 style={{ 
                  fontSize: "24px", 
                  fontWeight: "bold", 
                  margin: 0, 
                  color: "#212529" 
                }}>
                  Order Issues
                </h2>
              </div>
              <p style={{ 
                color: "#6c757d", 
                marginBottom: "24px" 
              }}>
                Select a topic to get help
              </p>

              {/* Issues List */}
              <div>
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
                    <span style={{ 
                      fontWeight: "500", 
                      color: "#212529" 
                    }}>
                      {item.title}
                    </span>
                    <FaChevronRight color="#6c757d" />
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Detail View */}
            <div style={{ 
              background: "#fff", 
              borderRadius: "8px", 
              padding: "24px", 
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)" 
            }}>
              {/* Back Button */}
              <button
                onClick={handleBack}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "transparent",
                  border: "none",
                  color: "#0d6efd",
                  cursor: "pointer",
                  fontSize: "16px",
                  marginBottom: "24px",
                  padding: "0",
                }}
              >
                <FaArrowLeft />
                Back to all issues
              </button>

              {/* Issue Header */}
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "16px", 
                marginBottom: "24px" 
              }}>
                {React.createElement(selectedIssue.icon, { 
                  size: 32, 
                  color: "#0d6efd" 
                })}
                <h2 style={{ 
                  fontSize: "24px", 
                  fontWeight: "bold", 
                  margin: 0, 
                  color: "#212529" 
                }}>
                  {selectedIssue.title}
                </h2>
              </div>

              {/* Help Section */}
              <div style={{ 
                marginBottom: "24px" 
              }}>
                <h3 style={{ 
                  fontSize: "18px", 
                  fontWeight: "600", 
                  marginBottom: "12px", 
                  color: "#212529" 
                }}>
                  Help & Information
                </h3>
                <p style={{ 
                  color: "#495057", 
                  lineHeight: "1.6" 
                }}>
                  {selectedIssue.content}
                </p>
              </div>

              {/* Conditional Content Based on Issue ID */}
              {selectedIssue.id === 1 && (
                <div style={{ 
                  marginTop: "20px", 
                  padding: "16px", 
                  background: "#f8f9fa", 
                  borderRadius: "6px" 
                }}>
                  <label style={{ 
                    display: "block", 
                    marginBottom: "8px", 
                    fontWeight: "500", 
                    color: "#212529" 
                  }}>
                    Order Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your order number"
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ced4da",
                      borderRadius: "6px",
                      fontSize: "16px",
                      marginBottom: "12px",
                    }}
                  />
                  <button
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "#0d6efd",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "16px",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                  >
                    Track Order
                  </button>
                </div>
              )}

              {selectedIssue.id === 2 && (
                <div style={{ 
                  marginTop: "20px", 
                  padding: "16px", 
                  background: "#fff3cd", 
                  borderRadius: "6px", 
                  border: "1px solid #ffc107" 
                }}>
                  <p style={{ 
                    margin: "0 0 12px 0", 
                    color: "#856404" 
                  }}>
                    <strong>Note:</strong> Cancellation is only possible within 24 hours of placing the order.
                  </p>
                  <button
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "#dc3545",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "16px",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                  >
                    Cancel Order
                  </button>
                </div>
              )}

              {selectedIssue.id === 3 && (
                <div style={{ 
                  marginTop: "20px" 
                }}>
                  <div style={{ 
                    padding: "16px", 
                    background: "#e7f3ff", 
                    borderRadius: "6px", 
                    marginBottom: "16px", 
                    borderLeft: "4px solid #0d6efd" 
                  }}>
                    <strong style={{ color: "#212529" }}>Return policy:</strong>
                    <p style={{ 
                      margin: "5px 0 0 0", 
                      color: "#495057" 
                    }}>
                      The product should be in its original condition with tags and packaging intact.
                    </p>
                  </div>
                  <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "1fr 1fr", 
                    gap: "12px" 
                  }}>
                    <button
                      style={{
                        padding: "12px",
                        background: "#0d6efd",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "16px",
                        cursor: "pointer",
                        fontWeight: "500",
                      }}
                    >
                      Return Item
                    </button>
                    <button
                      style={{
                        padding: "12px",
                        background: "#6c757d",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "16px",
                        cursor: "pointer",
                        fontWeight: "500",
                      }}
                    >
                      Exchange Item
                    </button>
                  </div>
                </div>
              )}

              {selectedIssue.id === 4 && (
                <div style={{ 
                  marginTop: "20px", 
                  display: "grid", 
                  gap: "12px" 
                }}>
                  <button
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "#0d6efd",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "16px",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                  >
                    View Order Details
                  </button>
                  <button
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "#198754",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "16px",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                  >
                    Download Invoice
                  </button>
                </div>
              )}

              {selectedIssue.id === 5 && (
                <div style={{ 
                  marginTop: "20px", 
                  padding: "16px", 
                  background: "#f8f9fa", 
                  borderRadius: "6px" 
                }}>
                  <label style={{ 
                    display: "block", 
                    marginBottom: "8px", 
                    fontWeight: "500", 
                    color: "#212529" 
                  }}>
                    New Shipping Address
                  </label>
                  <textarea
                    placeholder="Enter new address"
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ced4da",
                      borderRadius: "6px",
                      fontSize: "16px",
                      marginBottom: "12px",
                      minHeight: "80px",
                      resize: "vertical",
                    }}
                  />
                  <button
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "#198754",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "16px",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                  >
                    Update Address
                  </button>
                </div>
              )}

              {/* Contact Support */}
              <div style={{ 
                marginTop: "24px", 
                background: "#e7f3ff", 
                padding: "16px", 
                borderRadius: "8px", 
                borderLeft: "4px solid #0d6efd" 
              }}>
                <strong style={{ color: "#212529" }}>Need more help?</strong>
                <p style={{ 
                  margin: "5px 0 0 0", 
                  color: "#495057" 
                }}>
                  Contact our customer support at support@example.com or call 91+8889174066
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderIssues;