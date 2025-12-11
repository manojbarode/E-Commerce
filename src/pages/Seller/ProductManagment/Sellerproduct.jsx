import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { deleteProduct, getSellerProducts } from "../../../api/SellApi";
import "./SellerProducts.css";

export default function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const sellerUid = localStorage.getItem("sellerUid");

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getSellerProducts(sellerUid);
      setProducts(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (productId) => {
  if (window.confirm("Are you sure you want to delete this product?")) {
    try {
      await deleteProduct(productId);
      toast.success("Product deleted successfully");
      navigate("/sellerdashboard")
    } catch (err) {
      toast.error(err.response?.error || "Delete failed");
    }
  }
};

  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return products.filter((p) => {
      const base =
        p.title?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term);

      const dynamic = Object.values(p.dynamicFields || {}).some((v) =>
        String(v).toLowerCase().includes(term)
      );

      return base || dynamic;
    });
  }, [products, searchTerm]);

  const EditIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );

  const DeleteIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );

  return (
    <div className="seller-products-container">
      <div className="container">

        {/* HEADER */}
        <div className="header-section">
          <h1 className="page-title">My Products</h1>
          <p className="page-subtitle">Manage and organize your product inventory</p>
        </div>

        {/* SEARCH */}
        <div className="search-section">
          <div className="search-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>

            <input type="text" className="search-input" placeholder="Search products..."value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}/>
          </div>
        </div>
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
          </div>
        )}
        {!loading && filteredProducts.length === 0 && (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>

            <h4>{searchTerm ? "No products found" : "No products yet"}</h4>
            <p>{searchTerm ? "Try adjusting your search terms" : "Add your first product"}</p>
          </div>
        )}

        {/* PRODUCT TABLE */}
        {!loading && filteredProducts.length > 0 && (
          <div className="premium-card">
            <div className="table-responsive">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product Details</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Additional Info</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((p) => (
                    <tr key={p.productUid}>
                      <td>
                        <img src={p.imageUrls?.[0] || "https://via.placeholder.com/80"}alt={p.title}
                          className="product-img" />
                      </td>

                      <td>
                        <h6 className="product-title">{p.title || "-"}</h6>
                        <p className="product-description">{p.description || "-"}</p>
                      </td>

                      <td><span className="price-tag">₹{p.price || 0}</span></td>

                      <td>
                        <span className={`stock-badge ${p.stock > 0 ? "stock-available" : "stock-out"}`}>
                          {p.stock > 0 ? `${p.stock} in stock` : "Out of Stock"}
                        </span>
                      </td>

                      <td>
                        <div className="dynamic-fields">
                          {Object.entries(p.dynamicFields || {}).map(([key, value]) => (
                            <div key={key} className="field-item">
                              <span className="field-key">{key}:</span>
                              <span className="field-value">{value}</span>
                            </div>
                          ))}

                          {(!p.dynamicFields || Object.keys(p.dynamicFields).length === 0) && (
                            <span className="text-muted">-</span>
                          )}
                        </div>
                      </td>

                      <td>
                        <div className="action-buttons">
                          <button className="btn-action btn-edit" onClick={() => navigate(`/seller/update-product/${p.productUid}`)}>
                            <EditIcon /> Edit
                          </button>

                          <button className="btn-action btn-delete" onClick={() => handleDelete(p.productUid)}>
                            <DeleteIcon /> Delete
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* RESULTS COUNT */}
        {!loading && filteredProducts.length > 0 && (
          <div className="results-counter">
            <small>
              Showing {filteredProducts.length} of {products.length} products
            </small>
          </div>
        )}

      </div>
    </div>
  );
}
