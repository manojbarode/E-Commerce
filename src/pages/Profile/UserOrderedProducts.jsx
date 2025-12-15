import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "./UserOrderedProduct.css";
import { productFetchedByUser } from "../../api/authApi";

export default function UserOrderedProducts() {
  const [products, setProducts] = useState([]);
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
      const  data  = await productFetchedByUser(userUid);
      setProducts(data || []);
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

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    const term = searchTerm.toLowerCase();
    return products.filter((p) => {
      const titleMatch = p.title?.toLowerCase().includes(term);
      const descMatch = p.description?.toLowerCase().includes(term);
      const dynamicMatch = Object.values(p.dynamicFields || {}).some((v) =>
        String(v).toLowerCase().includes(term)
      );
      return titleMatch || descMatch || dynamicMatch;
    });
  }, [products, searchTerm]);

  const SearchIcon = () => <i className="bi bi-search fs-5 me-2"></i>;
  const PackageIcon = () => <i className="bi bi-box-seam display-1 text-secondary"></i>;

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center vh-100">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted fs-5">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="user-ordered-products py-5 position-relative">
      <div className="premium-bg"></div>
      <div className="container position-relative">
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
          <div>
            <h1 className="h2 mb-1 text-gradient">
              <span className="me-2">📦</span>My Ordered Products
            </h1>
            <p className="text-muted mb-0">View all your purchased items in one place</p>
          </div>
          <div className="badge bg-gradient text-white fs-6 shadow">
            Total Orders: {products.length}
          </div>
        </div>

        {/* SEARCH */}
        <div className="input-group mb-4 shadow-sm rounded-pill overflow-hidden premium-search">
          <span className="input-group-text bg-white border-0">
            <SearchIcon />
          </span>
          <input
            type="text"
            className="form-control border-0"
            placeholder="Search by product name, description, or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="btn btn-outline-secondary border-0"
              onClick={() => setSearchTerm("")}
            >
              ✕
            </button>
          )}
        </div>

        {/* EMPTY STATE */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-5 bg-white rounded-4 shadow-sm">
            <PackageIcon />
            <h3 className="mt-3">{searchTerm ? "No products found" : "No orders yet"}</h3>
            <p className="text-muted">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Your ordered products will appear here"}
            </p>
            {searchTerm && (
              <button
                className="btn btn-primary rounded-pill px-4"
                onClick={() => setSearchTerm("")}
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* PRODUCTS GRID */}
        {filteredProducts.length > 0 && (
          <>
            <div className="row g-4">
              {filteredProducts.map((product) => (
                <div key={product.productUid} className="col-sm-12 col-md-6 col-lg-4">
                  <div className="card h-100 shadow-lg border-0 product-card premium-card">
                    <div className="position-relative overflow-hidden rounded-top">
                      <img
                        src={product.imageUrls?.[0] || "https://via.placeholder.com/300"}
                        className="card-img-top product-image"
                        alt={product.title}
                      />
                      <span className="position-absolute top-0 start-0 badge bg-gradient m-2 shadow-sm">
                        Qty: {product.quantity || 1}
                      </span>
                    </div>
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{product.title}</h5>
                      <p className="card-text text-truncate">{product.description}</p>
                      {product.dynamicFields && (
                        <ul className="list-group list-group-flush mb-3">
                          {Object.entries(product.dynamicFields).map(([key, value]) => (
                            <li
                              key={key}
                              className="list-group-item py-1 d-flex justify-content-between"
                            >
                              <span className="text-muted">{key}</span>
                              <span>{value}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="mt-auto d-flex justify-content-between align-items-center">
                        <span className="fw-bold text-gradient fs-5">
                          ₹{product.price?.toLocaleString()}
                        </span>
                        {product.orderDate && (
                          <small className="text-muted">
                            Ordered on {new Date(product.orderDate).toLocaleDateString()}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-4 text-muted">
              Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> products
            </div>
          </>
        )}
      </div>
    </div>
  );
}
