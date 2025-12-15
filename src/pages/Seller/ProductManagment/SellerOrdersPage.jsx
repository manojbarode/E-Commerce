import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SellerOrdersPage.css";
import SellerOrdersService from "../../../api/orderApi";

const SellerOrdersPage = () => {
  const sellerUid = useSelector(state => state.seller.sellerUid);

  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sellerUid) fetchOrders();
  }, [sellerUid, page]);

  const fetchOrders = async () => {
  if (!sellerUid) return;
  try {
    setLoading(true);
    const pageData = await SellerOrdersService.getSellerOrders(sellerUid, page, 10);
    setOrders(pageData.content || []);
    setTotalPages(pageData.totalPages || 0);
  } catch (err) {
    console.error("Error fetching seller orders", err);
    setOrders([]);
    setTotalPages(0);
  } finally {
    setLoading(false);
  }
};



  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <h5>No orders found</h5>
      </div>
    );
  }

  return (
    <div className="seller-orders-page min-vh-100 bg-light">
      <div className="bg-primary text-white py-4 mb-4">
        <div className="container d-flex justify-content-between">
          <h4 className="fw-bold">Seller Orders</h4>
          <span className="badge bg-white text-primary">
            Page {page + 1} of {totalPages}
          </span>
        </div>
      </div>

      <div className="container">
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Order</th>
                  <th>Product</th>
                  <th className="text-center">Qty</th>
                  <th className="text-end">Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.orderUid}>
                    <td>
                      <strong>{order.orderUid}</strong>
                      <div className="text-muted small">{order.maskIdentifier}</div>
                    </td>

                    <td className="d-flex align-items-center">
                      <img src={order.imageUrls?.[0] || "https://via.placeholder.com/60"}
                        alt={order.productTitle} width="60" height="60"className="rounded me-2"/>
                      {order.productTitle}
                    </td>

                    <td className="text-center">
                      <span className="badge bg-secondary">{order.quantity}</span>
                    </td>

                    <td className="text-end fw-bold text-success">
                      {SellerOrdersService.formatCurrency(order.totalAmount)}
                    </td>

                    <td>
                      <span
                        className={`badge bg-${SellerOrdersService.getStatusBadgeClass(order.orderStatus)}`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>

                    <td>
                      {SellerOrdersService.formatDate(order.orderDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="d-flex justify-content-end mt-3">
          <ul className="pagination">
            <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPage(page - 1)}>Prev</button>
            </li>
            <li className={`page-item ${page === totalPages - 1 || totalPages === 0 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPage(page + 1)}>Next</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SellerOrdersPage;
