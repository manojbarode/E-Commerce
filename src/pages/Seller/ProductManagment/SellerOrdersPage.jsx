import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SellerOrdersPage.css";
import SellerOrdersService from "../../../api/orderApi";

const PAGE_SIZE = 10;

const SellerOrdersPage = () => {
  const token = useSelector((state) => state.seller.token);

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch paged orders whenever token or page changes
  useEffect(() => {
    if (!token) return;
    fetchPagedOrders();
  }, [token, page]);

  // Filter orders locally when search changes
  useEffect(() => {
    if (!search) {
      setFilteredOrders(orders);
      return;
    }

    const filtered = orders.filter((o) =>
      o.productTitle?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [search, orders]);

  const fetchPagedOrders = async () => {
    try {
      setLoading(true);
      const res = await SellerOrdersService.getSellerOrders(page, PAGE_SIZE);
      
    console.log("Response from API:", res); // log the entire API response
    console.log("Orders content:", res.content);

      setOrders(res.content || []);
      setFilteredOrders(res.content || []);
      setTotalPages(res.totalPages || 0);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: "3rem", height: "3rem" }} />
          <p className="text-muted fw-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="seller-orders-premium min-vh-100 bg-light">
      <div className="premium-header py-5 shadow-sm">
        <div className="container">
          <div className="row align-items-center mb-4">
            <div className="col-md-6">
              <h2 className="text-white fw-bold mb-2">
                <i className="bi bi-cart-check-fill me-2"></i> Seller Orders
              </h2>
              <p className="text-white-50 mb-0">Manage and track your orders efficiently</p>
            </div>
            <div className="col-md-6 text-md-end mt-3 mt-md-0">
              <span className="badge bg-white text-primary px-3 py-2 rounded-pill shadow-sm">
                {filteredOrders.length} Orders
              </span>
            </div>
          </div>

          <div className="search-container position-relative">
            <i className="bi bi-search search-icon position-absolute"></i>
            <input
              className="form-control premium-search shadow"
              placeholder="Search by Product Title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="btn btn-link position-absolute clear-btn" onClick={() => setSearch("")}>
                <i className="bi bi-x-circle-fill text-muted"></i>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container py-4">
        {filteredOrders.length === 0 ? (
          <div className="premium-empty card shadow-sm border-0 text-center py-5">
            <div className="card-body">
              <i className="bi bi-inbox display-1 mb-3"></i>
              <h5 className="fw-bold">No orders found</h5>
              <p className="text-muted">
                {search ? "No matching product found on this page" : "No orders available"}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="card premium-card shadow-sm border-0 d-none d-lg-block">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Order</th>
                      <th>Product</th>
                      <th className="text-center">Qty</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((o) => (
                      <tr key={o.orderUid}>
                        <td>
                          <div className="small text-muted">{o.maskIdentifier}</div>
                        </td>
                        <td className="d-flex align-items-center gap-3">
                          <img src={o.items?.[0]?.imageUrls?.[0] || "https://via.placeholder.com/60"} width="60"
                            height="60" className="rounded-3"alt={o.items?.[0]?.productName || "product"}/> 
                          {o.productTitle}
                        </td>
                        <td className="text-center">{o.quantity}</td>
                        <td className="fw-bold text-success">
                          {SellerOrdersService.formatCurrency(o.totalAmount)}
                        </td>
                        <td>
                          <span className={`badge bg-${SellerOrdersService.getStatusBadgeClass(o.orderStatus)}`}>
                            {o.orderStatus}
                          </span>
                        </td>
                        <td>{SellerOrdersService.formatDate(o.orderDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile view */}
            <div className="d-lg-none">
              <div className="row g-3">
                {filteredOrders.map((o) => (
                  <div key={o.orderUid} className="col-12">
                    <div className="card mobile-order-card shadow-sm border-0">
                      <div className="card-body">
                        <div className="d-flex gap-3 mb-3">
                          <img src={o.items?.[0]?.imageUrls?.[0] || "https://via.placeholder.com/80"}
                            width="80" height="80" className="rounded-3" alt={o.items?.[0]?.productName || "product"}/>

                          <div>
                            <h6 className="fw-bold mb-1">{o.productTitle}</h6>
                            <span className={`badge bg-${SellerOrdersService.getStatusBadgeClass(o.orderStatus)}`}>
                              {o.orderStatus}
                            </span>
                          </div>
                        </div>

                        <div className="d-flex justify-content-between">
                          <span>{o.quantity} pcs</span>
                          <span className="fw-bold text-success">{SellerOrdersService.formatCurrency(o.totalAmount)}</span>
                        </div>

                        <div className="text-muted mt-2">{SellerOrdersService.formatDate(o.orderDate)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-end mt-4">
            <ul className="pagination pagination-modern">
              <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setPage((p) => p - 1)}>Prev</button>
              </li>
              <li className="page-item active">
                <span className="page-link">{page + 1} / {totalPages}</span>
              </li>
              <li className={`page-item ${page === totalPages - 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setPage((p) => p + 1)}>Next</button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerOrdersPage;
