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
  const [viewMode, setViewMode] = useState("grid");
  const { isLoggedIn } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const loadOrderedProducts = async () => {
    if (!isLoggedIn) {
      toast.warning("Login required to access orders");
      navigate("/login");
      return;
    }

    try {
      const response = await productFetchedByUser();
      let ordersData = [];

      if (Array.isArray(response)) ordersData = response;
      else if (response?.content) ordersData = response.content;
      else if (response?.data?.content) ordersData = response.data.content;
      else if (response?.data) ordersData = Array.isArray(response.data) ? response.data : [response.data];

      const flattenedOrders = ordersData.flatMap(order =>
        (order.items || []).map(item => ({
          orderUid: order.orderUid,
          orderDate: order.orderDate,
          orderStatus: order.orderStatus,
          productUid: item.productUid,
          productTitle: item.productName || item.productTitle || "Unknown Product",
          quantity: item.quantity || 0,
          priceAtTime: item.priceAtTime || 0,
          itemTotal: item.itemTotal || 0,
          imageUrls: item.imageUrls || []
        }))
      );

      setOrders(flattenedOrders);
      toast.success(`Loaded ${flattenedOrders.length} order items`);
    } catch (err) {
      toast.error(`Failed to load orders: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) loadOrderedProducts();
    else setLoading(false);
  }, [isLoggedIn]);

  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;
    const term = searchTerm.toLowerCase();
    return orders.filter(order => order.productTitle.toLowerCase().includes(term));
  }, [orders, searchTerm]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "DELIVERED": return "status-delivered";
      case "SHIPPED": return "status-shipped";
      case "CANCELLED": return "status-cancelled";
      default: return "status-pending";
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="spinner-border text-light" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="loading-text">Loading your orders...</p>
    </div>
  );

  return (
    <div className="user-ordered-products">
      <div className="animated-bg"></div>
      <div className="bg-overlay"></div>
      <div className="particle particle-1"></div>
      <div className="particle particle-2"></div>
      <div className="particle particle-3"></div>

      <div className="container content-wrapper">
        {/* Header */}
        <div className="header-section">
          <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
            <div>
              <h1 className="page-title"><span className="title-icon">🛍️</span> My Orders</h1>
              <p className="page-subtitle">Track and manage your purchases</p>
            </div>
            <div className="stats-card">
              <div className="stats-number">{orders.length}</div>
              <div className="stats-label">Total Items</div>
            </div>
          </div>
        </div>

        {/* Search & View Toggle */}
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-4 gap-2">
          <div className="search-wrapper flex-grow-1">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="form-control search-input"
              placeholder="Search orders or products..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            {searchTerm && <button className="btn clear-btn" onClick={() => setSearchTerm("")}>✕</button>}
          </div>
          <div className="view-toggle">
            <button className={`toggle-btn ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")}>▦</button>
            <button className={`toggle-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")}>☰</button>
          </div>
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3 className="empty-title">No orders found</h3>
            <p className="empty-text">{orders.length === 0 ? "Start shopping to see your orders here" : "Try adjusting your search"}</p>
          </div>
        )}

        {/* Orders */}
        {filteredOrders.length > 0 && (
          <div className={`row g-3 ${viewMode === "list" ? "orders-list-view" : ""}`}>
            {filteredOrders.map((order, idx) => (
              <div key={`${order.orderUid}-${order.productUid}-${idx}`} className={viewMode === "grid" ? "col-6 col-sm-6 col-md-4 col-lg-3 col-xl-2dot4" : "col-12"}>
                <div className={`order-card ${viewMode === "list" ? "order-list-item" : ""}`}>
                  <div className="image-container">
                    <img
                      src={order.imageUrls?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                      className="product-image"
                      alt={order.productTitle}
                      onError={e => e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'}
                    />
                    <span className={`status-badge ${getStatusBadgeClass(order.orderStatus)}`}>
                      {order.orderStatus || "PENDING"}
                    </span>
                  </div>
                  <div className="card-body-content">
                    <h5 className="product-title">{order.productTitle}</h5>
                    <div className="details-grid">
                      <div className="detail-item"><span className="detail-label">Price</span><span className="detail-value">₹{Number(order.priceAtTime).toLocaleString()}</span></div>
                      <div className="detail-item"><span className="detail-label">Quantity</span><span className="quantity-badge">{order.quantity}</span></div>
                      <div className="detail-item"><span className="detail-label">Total</span><span className="total-value">₹{Number(order.itemTotal).toLocaleString()}</span></div>
                      <div className="detail-item"><span className="detail-label">Date</span><span className="detail-value">{order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) : "—"}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
