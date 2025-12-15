import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "./UserOrderedProduct.css";
import { productFetchedByUser } from "../../api/authApi";

export default function UserOrderedProducts() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const user = useSelector(
    (state) => state.auth?.user || JSON.parse(localStorage.getItem("user"))
  );

  const userUid = user?.userUid;

  const loadOrderedProducts = async () => {
    if (!userUid) return;

    try {
      setLoading(true);
      const ordersList = await productFetchedByUser(userUid);
      setOrders(ordersList);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load ordered products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderedProducts();
  }, [userUid]);

  /* 🔍 SEARCH FILTER */
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

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h3 mb-1">My Ordered Products</h1>
            <p className="text-muted mb-0">
              Complete list of your purchased products
            </p>
          </div>

          <span className="badge bg-primary fs-6">
            Total Orders: {orders.length}
          </span>
        </div>

        {/* SEARCH */}
        <div className="input-group mb-4">
          <input type="text" className="form-control" placeholder="Search by product name..." value={searchTerm}
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

        {/* EMPTY */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-5 bg-white rounded shadow-sm">
            <h4>No orders found</h4>
            <p className="text-muted">
              Try adjusting your search keywords
            </p>
          </div>
        )}

        {/* TABLE */}
        {filteredOrders.length > 0 && (
          <div className="table-responsive bg-white rounded shadow-sm">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Price (₹)</th>
                  <th>Quantity</th>
                  <th>Order Date</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr key={order.orderUid}>
                    <td>{index + 1}</td>

                    {/* IMAGE */}
                    <td>
                      {order.imageUrls?.length > 0 ? (
                        <img src={order.imageUrls[0]} alt={order.productTitle}className="table-product-image"/>

                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>

                    <td className="fw-semibold">
                      {order.productTitle}
                    </td>

                    <td className="fw-bold">
                      ₹{order.totalAmount?.toLocaleString()}
                    </td>

                    <td>{order.quantity}</td>

                    <td>
                      {order.orderDate
                        ? new Date(order.orderDate).toLocaleDateString()
                        : "—"}
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
