import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "./UserOrderedProduct.css";
import { productFetchedByUser } from "../../api/authApi";
import { useNavigate } from "react-router-dom";

export default function UserOrderedProducts() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState(null);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const loadOrderedProducts = async () => {
    if (!isLoggedIn) {
      toast.warning("Login required to access orders");
      navigate("/login");
      return;
    }

    try {
      console.log("🔄 Starting API call to fetch orders...");
      
      const response = await productFetchedByUser();
      
      console.log("✅ Full API Response:", response);
      console.log("📦 Response type:", typeof response);
      console.log("📦 Response keys:", Object.keys(response || {}));
      
      // Save debug info
      setDebugInfo({
        fullResponse: JSON.stringify(response, null, 2),
        responseType: typeof response,
        hasContent: !!response?.content,
        hasData: !!response?.data,
        contentLength: response?.content?.length || 0
      });

      // Try different response structures
      let ordersData = [];
      
      if (Array.isArray(response)) {
        console.log("📋 Response is direct array");
        ordersData = response;
      } else if (response?.content) {
        console.log("📋 Response has 'content' property");
        ordersData = response.content;
      } else if (response?.data?.content) {
        console.log("📋 Response has 'data.content' property");
        ordersData = response.data.content;
      } else if (response?.data) {
        console.log("📋 Response has 'data' property");
        ordersData = Array.isArray(response.data) ? response.data : [response.data];
      } else {
        console.error("❌ Unknown response structure:", response);
        toast.error("Unexpected response format");
        return;
      }

      console.log("📊 Orders data:", ordersData);
      console.log("📊 Orders count:", ordersData.length);

      if (!Array.isArray(ordersData)) {
        console.error("❌ ordersData is not an array:", ordersData);
        toast.error("Invalid data format received");
        return;
      }

      if (ordersData.length === 0) {
        console.log("ℹ️ No orders found");
        setOrders([]);
        toast.info("No orders found");
        return;
      }

      // Check first order structure
      console.log("🔍 First order structure:", ordersData[0]);
      console.log("🔍 First order items:", ordersData[0]?.items);

      // Flatten orders
      const flattenedOrders = ordersData.flatMap((order) => {
        if (!order.items || !Array.isArray(order.items)) {
          console.warn("⚠️ Order has no items array:", order);
          return [];
        }

        return order.items.map((item) => ({
          // Order level details
          orderUid: order.orderUid,
          orderDate: order.orderDate,
          paymentMethod: order.paymentMethod,
          orderStatus: order.orderStatus,
          paymentStatus: order.paymentStatus,
          shippingAmount: order.shippingAmount,
          totalAmount: order.totalAmount,
          currency: order.currency || "INR",
          
          // Item level details
          productUid: item.productUid,
          productTitle: item.productName || item.productTitle || "Unknown Product",
          quantity: item.quantity || 0,
          priceAtTime: item.priceAtTime || 0,
          itemTotal: item.itemTotal || 0,
          sellerUid: item.sellerUid,
          imageUrls: item.imageUrls || []
        }));
      });

      console.log("✨ Flattened orders:", flattenedOrders);
      console.log("✨ Flattened orders count:", flattenedOrders.length);

      setOrders(flattenedOrders);
      toast.success(`Loaded ${flattenedOrders.length} order items`);

    } catch (err) {
      console.error("❌ Error loading orders:", err);
      console.error("❌ Error response:", err.response);
      console.error("❌ Error message:", err.message);
      
      setDebugInfo({
        error: err.message,
        errorResponse: err.response?.data,
        errorStatus: err.response?.status
      });

      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else if (err.response?.status === 403) {
        toast.error("Access denied. Please check your permissions.");
      } else {
        toast.error(`Failed to load orders: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadOrderedProducts();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;
    const term = searchTerm.toLowerCase();
    return orders.filter((order) =>
      order.productTitle?.toLowerCase().includes(term)
    );
  }, [orders, searchTerm]);

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center vh-100">
        <div className="spinner-border text-primary mb-3" />
        <p className="text-muted fs-5">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="user-ordered-products py-5 position-relative">
      <div className="container">
        
        {/* Debug Info Section (Remove in production) */}
        {debugInfo && (
          <div className="alert alert-info mb-4">
            <h5>🔧 Debug Information:</h5>
            <pre className="mb-0" style={{ fontSize: '12px', maxHeight: '200px', overflow: 'auto' }}>
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h3 mb-1">My Ordered Products</h1>
            <p className="text-muted mb-0">
              Complete list of your purchased products
            </p>
          </div>

          <span className="badge bg-primary fs-6">
            Total Items: {orders.length}
          </span>
        </div>

        <div className="input-group mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="btn btn-outline-secondary"
              onClick={() => setSearchTerm("")}
            >
              ✕
            </button>
          )}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-5 bg-white rounded shadow-sm">
            <h4>No orders found</h4>
            <p className="text-muted">
              {orders.length === 0
                ? "You haven't placed any orders yet"
                : "Try adjusting your search keywords"}
            </p>
          </div>
        )}

        {filteredOrders.length > 0 && (
          <div className="table-responsive bg-white rounded shadow-sm">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Order ID</th>
                  <th>Product Name</th>
                  <th>Price (₹)</th>
                  <th>Quantity</th>
                  <th>Item Total (₹)</th>
                  <th>Order Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr key={`${order.orderUid}-${order.productUid}-${index}`}>
                    <td>{index + 1}</td>
                    <td>
                      <small className="text-muted font-monospace">
                        {order.orderUid || "N/A"}
                      </small>
                    </td>
                    <td className="fw-semibold">{order.productTitle}</td>
                    <td className="fw-bold">
                      ₹{Number(order.priceAtTime || 0).toLocaleString()}
                    </td>
                    <td>
                      <span className="badge bg-secondary">{order.quantity}</span>
                    </td>
                    <td className="fw-bold text-success">
                      ₹{Number(order.itemTotal || 0).toLocaleString()}
                    </td>
                    <td>
                      {order.orderDate
                        ? new Date(order.orderDate).toLocaleDateString('en-IN')
                        : "—"}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          order.orderStatus === "DELIVERED"
                            ? "bg-success"
                            : order.orderStatus === "SHIPPED"
                            ? "bg-info"
                            : order.orderStatus === "CANCELLED"
                            ? "bg-danger"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {order.orderStatus || "PENDING"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}